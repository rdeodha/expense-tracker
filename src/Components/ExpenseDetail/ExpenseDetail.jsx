import React, { useState, useEffect } from 'react';

export default function ExpenseDetail({ getGoogleDriveContents, selectedExpenseReport }) {
    const [expenseDetails, setExpenseDetails] = useState([]);

    useEffect(() => {
        const getExpenseDetails = async () => {
            const queryParams = {
                q: `'${selectedExpenseReport}' in parents`,
                fields: 'files(id, name, mimeType), nextPageToken',
                pageSize: 20
            }
            
            setExpenseDetails(await getGoogleDriveContents(queryParams));
        };

        if (selectedExpenseReport) {
            getExpenseDetails();
        }
    }, [selectedExpenseReport]);

    return (
        <>
            {expenseDetails.map((expense) => {
                return (
                    <div key={expense.id}>
                        <h4><b>{expense.name}</b></h4>
                    </div>
                )
            })}
        </>
    )
}
