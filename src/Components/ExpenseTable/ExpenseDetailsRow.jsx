import PropTypes from 'prop-types';

import { Fragment, useState } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ExpenseDetailsRow({ row }) {
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{bgcolor: 'rgb(6,12,18)'}}>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" sx={{bgcolor: 'rgb(6,12,18)'}}>
                    {row.cost}
                </TableCell>
                <TableCell align="left" sx={{bgcolor: 'rgb(6,12,18)'}}>{row.paymentTo}</TableCell>
                <TableCell align="left" sx={{bgcolor: 'rgb(6,12,18)'}}>{row.reimbursed ? 'Reimbursed' : 'NOT Reimbursed'}</TableCell>
                <TableCell align="left" sx={{bgcolor: 'rgb(6,12,18)'}}>{row.dateIssued}</TableCell>
                <TableCell align="left" sx={{bgcolor: 'rgb(6,12,18)'}}>{row.dateCreated}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell  sx={{bgcolor: 'rgb(28,34,39)'}} style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Additional Info
                            </Typography>
                            <Typography variant="caption">
                                {row.description}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

ExpenseDetailsRow.propTypes = {
    row: PropTypes.shape({
        cost: PropTypes.number.isRequired,
        paymentTo: PropTypes.string.isRequired,
        reimbursed: PropTypes.bool.isRequired,
        dateIssued: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
};