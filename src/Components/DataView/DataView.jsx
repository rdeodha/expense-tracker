import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import ExpenseCollectionList from '../ExpenseCollectionList/ExpenseCollectionList';
import ExpenseDetailsTable from '../ExpenseTable/ExpenseDetailsTable';

export default function DataView({ createNewExpenseCollection, getGoogleDriveContents, deleteAllFileIDsInsideFolder, setExpenseCollections, setIsLoadingData, createGoogleDriveObject, getGoogleDriveFileContents,  expenseCollections, signInStatus, rootFolderID}) {
    const [selectedExpenseReport, setSelectedExpenseCollection] = useState("");

    useEffect(() => {
        setSelectedExpenseCollection("");
    }, [signInStatus])

    return (
        <Box 
            sx={
                {          
                    display: 'flex',
                    flexDirection: 'row',
                }
            }
        >
            <ExpenseCollectionList 
                expenseCollections={expenseCollections}
                signInStatus={signInStatus}
                rootFolderID={rootFolderID}
                setSelectedExpenseCollection={setSelectedExpenseCollection}
                deleteAllFileIDsInsideFolder={deleteAllFileIDsInsideFolder}
                setExpenseCollections={setExpenseCollections}
                createNewExpenseCollection={createNewExpenseCollection}
                setIsLoadingData={setIsLoadingData}
            />
            <ExpenseDetailsTable 
                setIsLoadingData={setIsLoadingData}
                selectedExpenseReport={selectedExpenseReport}
                signInStatus={signInStatus}
                getGoogleDriveFileContents={getGoogleDriveFileContents}
                getGoogleDriveContents={getGoogleDriveContents}
                createGoogleDriveObject={createGoogleDriveObject}
            />
        </Box>
    )
}

DataView.propTypes = {
    createNewExpenseCollection: PropTypes.func.isRequired,
    getGoogleDriveContents: PropTypes.func.isRequired,
    createGoogleDriveObject: PropTypes.func.isRequired,
    getGoogleDriveFileContents: PropTypes.func.isRequired,
    expenseCollections: PropTypes.array.isRequired,
    signInStatus: PropTypes.bool.isRequired,
    rootFolderID: PropTypes.string.isRequired,
    setExpenseCollections: PropTypes.func.isRequired,
    setIsLoadingData: PropTypes.func.isRequired,
    deleteAllFileIDsInsideFolder: PropTypes.func.isRequired
};
