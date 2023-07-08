import React from 'react'

import './ExpenseView.css'

export default function ExpenseView({ expenseReports, setSelectedExpenseReport }) {
    return (
        <>
            {expenseReports.map((report) => {
                return (
                    <div key={report.id} className='dataCards'  onClick={() => setSelectedExpenseReport(report.id)}>
                        <h4><b>{report.name}</b></h4>
                    </div>
                )
            })}
        </>
    )
}
