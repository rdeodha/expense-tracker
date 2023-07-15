import { useState } from 'react';
import { gapi } from 'gapi-script';

import DataView from './Components/DataView/DataView';
import Navbar from './Components/Navbar/Navbar';

import './App.css'
// Client ID and API key from the Developer Console
const CLIENT_ID = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

function App() {
    // const [signedInUser, setSignedInUser] = useState(null);
    const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
    const [expenseCollections, setExpenseCollections] = useState([]);
    const [rootFolderID, setRootFolderID] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(false);

    const handleClientLoad = () => {
        setIsLoadingData(true);
        gapi.load('client:auth2', initClient);
        setIsLoadingData(false);
    }

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = async () => {
        await gapi.auth2.getAuthInstance().signOut();
        setIsGoogleSignedIn(false);
        // setSignedInUser(null);
        setExpenseCollections([]);
    };

    const getGoogleDriveContents = async (queryParams, includeMorePages = true) => {
        let nextPageToken = null;
        let includePageToken = false;
        let dataArray = [];

        do {
            if (includePageToken) {
                queryParams.pageToken = nextPageToken
            } else {
                includePageToken = true;
            }

            const data = await gapi.client.drive.files.list(queryParams);
            dataArray = dataArray.concat(data.result.files)
            nextPageToken = data.result?.nextPageToken;
        } while (nextPageToken && includeMorePages);

        return dataArray;
    }

    const createGoogleDriveObject = async (queryParams) => {
        try {
            return await gapi.client.drive.files.create(queryParams);
        } catch (error) {
            console.log(error)
            return null;
        }
    };

    const getGoogleDriveFileContents = async (queryParams) => {
        try {
            const response = await gapi.client.drive.files.get(queryParams);
            return response.body;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const createNewExpenseCollection = async (queryParams) => {
        const response = await gapi.client.drive.files.create({
            resource: queryParams,
            fields: 'id'
        });

        const newQueryParams = {
            q: `mimeType='application/vnd.google-apps.folder' and '${rootFolderID}' in parents and trashed=false`,
            fields: 'files(id, name, mimeType), nextPageToken',
            orderBy: 'name',
            pageSize: 100
        }

        setExpenseCollections(await getGoogleDriveContents(newQueryParams))

        return response.result.id;
    }

    const deleteGoogleDriveResource = async (fileId) => {
        try {
            return await gapi.client.drive.files.delete(
                {
                   fileId
                }
            );
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const deleteAllFileIDsInsideFolder = async (rootFolderID) => {
        const queryParams = {
            q: `'${rootFolderID}' in parents and trashed=false`,
            fields: 'files(id, mimeType), nextPageToken',
            pageSize: 100,
        }

        const subFiles = await getGoogleDriveContents(queryParams);

        for (const file of subFiles) {
            if (file.mimeType !== 'application/vnd.google-apps.folder') {
                await deleteGoogleDriveResource(file.id);
            } else {
                await deleteAllFileIDsInsideFolder(file.id);
            }
        }

        await deleteGoogleDriveResource(rootFolderID);
    }

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
        // setSignedInUser(gapi.auth2.getAuthInstance().currentUser.c2.value);
        // list files if user is authenticated
        findExpenseTrackerFolder();
    };

    /**
     * Print files.
     */
    const findExpenseTrackerFolder = async () => {
        setIsLoadingData(true);
        let folderID;
        let data = await gapi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='expense-tracker' and trashed=false`,
            fields: 'files(id, name)',
        });

        if (data.result.files.length === 0) {
            data = await createExpenseTrackerFolder();
        }

        folderID = data?.result?.files[0]?.id;
        setRootFolderID(folderID);

        const queryParams = {
            q: `mimeType='application/vnd.google-apps.folder' and '${folderID}' in parents and trashed=false`,
            fields: 'files(id, name, mimeType), nextPageToken',
            orderBy: 'name',
            pageSize: 100
        }

        setExpenseCollections(await getGoogleDriveContents(queryParams));
        setIsLoadingData(false);
    };

    /**
     * If the expense-tracker folder doesn't exist, create one
     */
    const createExpenseTrackerFolder = async () => {
        const fileMetadata = {
            name: 'expense-tracker',
            mimeType: 'application/vnd.google-apps.folder',
        };

        return createGoogleDriveObject(fileMetadata);
    }

    return (
        <>
            <Navbar 
                handleGoogleOAuthSignIn={handleClientLoad}
                handleGoogleOAuthSignOut={handleSignOutClick}
                signInStatus={isGoogleSignedIn}
                isLoadingData={isLoadingData}
            />
            <DataView 
                getGoogleDriveContents={getGoogleDriveContents}
                createGoogleDriveObject={createGoogleDriveObject}
                getGoogleDriveFileContents={getGoogleDriveFileContents}
                createNewExpenseCollection={createNewExpenseCollection}
                setExpenseCollections={setExpenseCollections}
                setIsLoadingData={setIsLoadingData}
                deleteAllFileIDsInsideFolder={deleteAllFileIDsInsideFolder}
                expenseCollections={expenseCollections}
                signInStatus={isGoogleSignedIn}
                rootFolderID={rootFolderID}
                
            />
        </>
    );
}

export default App;
