import React from 'react'
import './DataView.css'

export default function DataView({ expenseReports }) {
    return (
        <>
            <div className='dataView'>
                {expenseReports.map((report) => {
                    return (
                        <div className='dataCards'>
                            <h4><b>{report.name}</b></h4>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
