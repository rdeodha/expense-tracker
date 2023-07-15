import PropTypes from 'prop-types';
import moment from 'moment';

import { useState, useEffect } from 'react';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import ExpenseDetailsRow from './ExpenseDetailsRow';

export default function ExpenseDetailsTable({ getGoogleDriveContents, setIsLoadingData, createGoogleDriveObject, getGoogleDriveFileContents, selectedExpenseReport, signInStatus }) {
    const [totalCost, setTotalCost] = useState(null);
    const [expenseManifest, setExpenseManifest] = useState([]);
    const [anchorEl, setAnchorEl] = useState(false);

    const open = Boolean(anchorEl);

    const handleTableExtraClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTableExtraClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setTotalCost(null);
        setExpenseManifest([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInStatus])

    useEffect(() => {
        const getAllExpenses = async () => {
            setIsLoadingData(true);
            let queryParams = {
                q: `mimeType='application/vnd.google-apps.folder' and '${selectedExpenseReport}' in parents and trashed=false`,
                fields: 'files(id), nextPageToken',
                pageSize: 100
            }

            const response = await getGoogleDriveContents(queryParams);

            let expenseManifests = [];
            await Promise.all(response.map(async (expenseID) => {
                queryParams = {
                    q: `mimeType='application/json' and '${expenseID.id}' in parents and name='expense_manifest.json' and trashed=false`,
                    fields: 'files(id)',
                    pageSize: 1
                }

                const manifest = await getGoogleDriveContents(queryParams, false);

                if (manifest.length === 0 || manifest.length > 1) {
                    // There was an issue pulling the expense manifest. Need to delete all manifest.json files that are
                    // invalid, or create a new manifest file for the expense. Prompt user to fix this.
                    console.log(`There was an issue getting a manifest for ${expenseID.id}. There were ${manifest.length} manifest files found.`)
                }

                queryParams = {
                    fileId: manifest[0].id,
                    alt: 'media'
                }

                const manfiestContents = await getGoogleDriveFileContents(queryParams);
                expenseManifests.push(JSON.parse(manfiestContents));  
            }));

            expenseManifests = expenseManifests.sort((a, b) => {
                const dateA = moment(a.dateIssued);
                const dateB = moment(b.dateIssued);

                if (dateA < dateB) {
                    return -1;
                  }

                if (dateA > dateB) {
                    return 1;
                }
                  
                return 0;
            });

            let totalCost = 0;
            expenseManifests.map((expense) => {
                totalCost += expense.cost;
            });
            setTotalCost(totalCost);
            setExpenseManifest(expenseManifests);
            setIsLoadingData(false);
        };

        if (selectedExpenseReport) {
            getAllExpenses();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpenseReport]);

    return (
        <TableContainer
            sx={
                {
                    bgcolor: 'background.paper',
                    borderRadius: '20px',
                    borderColor: 'rgb(24,41,58)',
                    border: '1px solid rgb(24,41,58)    ',
                    margin: '10px',
                    maxHeight: '400px',
                    overflow: 'auto',
                }
            }
        >
            <Table stickyHeader aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}}>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={handleTableExtraClick}
                                disabled={!signInStatus}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleTableExtraClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem onClick={handleTableExtraClose}>Add Expense</MenuItem>
                                <MenuItem onClick={handleTableExtraClose}>Remove Expense</MenuItem>
                            </Menu>
                        </TableCell>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}} align="left">Cost</TableCell>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}} align="left">Payment To</TableCell>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}} align="left">Reinbursement Status</TableCell>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}} align="left">Issued Date</TableCell>
                        <TableCell sx={{bgcolor: 'rgb(28,34,39)'}} align="left">Expense Added Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenseManifest.map((row) => (
                        <ExpenseDetailsRow key={row.cost} row={row} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell align="left">{totalCost}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

ExpenseDetailsTable.propTypes = {
    getGoogleDriveContents: PropTypes.func.isRequired,
    createGoogleDriveObject: PropTypes.func.isRequired,
    setIsLoadingData: PropTypes.func.isRequired,
    getGoogleDriveFileContents: PropTypes.func.isRequired,
    selectedExpenseReport: PropTypes.string.isRequired,
    signInStatus: PropTypes.bool.isRequired,
};
