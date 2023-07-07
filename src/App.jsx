import React, { useState } from 'react';
import { gapi } from 'gapi-script';

import DataView from './Components/DataView/DataView';
import Navbar from './Components/Navbar/Navbar';

import './App.css';


// Client ID and API key from the Developer Console
const CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

function App() {
    const [signedInUser, setSignedInUser] = useState(null);
    const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
    const [expenseReports, setExpenseReports] = useState([]);

    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    }

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = async () => {
        await gapi.auth2.getAuthInstance().signOut();
        setIsGoogleSignedIn(false);
        setSignedInUser(null);
        setExpenseReports([]);
    };

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = async () => {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            });
        } catch (error) {
            console.log(error);
        }

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    const updateSigninStatus = async (isSignedIn) => {
        if (!isSignedIn) {
            await gapi.auth2.getAuthInstance().signIn();
        }

        setIsGoogleSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
        // Set the signed in user
        setSignedInUser(gapi.auth2.getAuthInstance().currentUser.c2.value);
        // list files if user is authenticated
        findExpenseTrackerFolder();
    };

    /**
     * Print files.
     */
    const findExpenseTrackerFolder = async () => {
        let folderID;

        let data = await gapi.client.drive.files.list({
            q: 'mimeType=\'application/vnd.google-apps.folder\' and name=\'expense-tracker\' and trashed=false',
            fields: 'files(id, name)',
        });

        if (data.result.files.length === 0) {
            data = await createExpenseTrackerFolder();
        }

        folderID = data?.result?.files[0]?.id;

        await getExpenseReports(folderID);
    };

    /**
     * If the expense-tracker folder doesn't exist, create one
     */
    const createExpenseTrackerFolder = async () => {
        const fileMetadata = {
            name: 'expense-tracker',
            mimeType: 'application/vnd.google-apps.folder',
        };

        try {
            return data = await gapi.client.drive.files.create({
                resource: fileMetadata,
                fields: 'id',
            });
        } catch (error) {
            console.log(error);
        }

        return null;
    }

    /**
     * Gets expense reports
     */
    const getExpenseReports = async (folderID) => {
        let nextPageToken = null;
        let includePageToken = false;
        let allExpenseReports = [];

        do {
            const queryParams = {
                q: `'${folderID}' in parents`,
                fields: 'files(id, name, mimeType), nextPageToken',
                pageSize: 20
            }

            if (includePageToken) {
                queryParams.pageToken = nextPageToken;
            } else {
                includePageToken = true;
            }

            const data = await gapi.client.drive.files.list(queryParams);

            allExpenseReports = allExpenseReports.concat(data.result.files);

            nextPageToken = data.result?.nextPageToken;
        } while (nextPageToken);

        setExpenseReports(allExpenseReports.reverse());
    }

    return (
        <>
            <Navbar 
                handleGoogleOAuthSignIn={handleClientLoad}
                handleGoogleOAuthSignOut={handleSignOutClick}
                signInStatus={isGoogleSignedIn}
            />
            <DataView 
                expenseReports={expenseReports}
            />
        </>
    );
}

export default App;
