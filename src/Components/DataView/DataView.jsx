import React, { useState } from 'react';

import './DataView.css'
import ExpenseView from '../ExpenseView/ExpenseView';
import ExpenseDetail from '../ExpenseDetail/ExpenseDetail';

export default function DataView({ getGoogleDriveContents, expenseReports }) {
    const [selectedExpenseReport, setSelectedExpenseReport] = useState(null);

    return (
        <>
            <div className='expenseView'>
                <ExpenseView 
                    expenseReports={expenseReports}
                    setSelectedExpenseReport={setSelectedExpenseReport}
                />
            </div>
            <div className='expenseDetail'>
                <ExpenseDetail 
                    selectedExpenseReport={selectedExpenseReport}
                    getGoogleDriveContents={getGoogleDriveContents}
                />
            </div>
        </>
    )
}
