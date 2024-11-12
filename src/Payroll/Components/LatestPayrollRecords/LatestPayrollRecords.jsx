import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of Navigate

const LatestPayrollRecords = () => {
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        const fetchPayrollRecords = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/payroll/latest');
                setPayrollRecords(response.data.latestPayrollRecords);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch payroll records');
            } finally {
                setLoading(false);
            }
        };

        fetchPayrollRecords();
    }, []);



    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <>
           <button
        onClick={() => navigate(-1)} 
        className="  mb-4 mt-10 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
      >
        &larr; 
      </button>
          
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
                {payrollRecords.length === 0 ? (
                    <p className="text-center text-gray-500">No payroll records found.</p>
                ) : (
                    <div className="flex flex-wrap -mx-4">
                        {payrollRecords.map((record) => (
                            <div key={record.employeeId} className="w-full md:w-1/3 px-4 mb-6">
                                <div className="p-4 bg-gray-100 rounded-md shadow-sm">
                                    <h2 className="text-xl font-semibold">{record.name}</h2>
                                    {record.latestPayroll ? (
                                        <div className="mt-2">
                                            <p><strong>Salary:</strong> ${record.latestPayroll.salary.toFixed(2)}</p>
                                            <p><strong>Bonuses:</strong> ${record.latestPayroll.bonuses.toFixed(2)}</p>
                                            <p><strong>Deductions:</strong> ${record.latestPayroll.deductions.toFixed(2)}</p>
                                            <p><strong>From:</strong> {record.latestPayroll.from ? new Date(record.latestPayroll.from).toLocaleDateString() : 'N/A'}</p>
                                            <p><strong>To:</strong> {record.latestPayroll.to ? new Date(record.latestPayroll.to).toLocaleDateString() : 'N/A'}</p>
                                            <p><strong>Processed on:</strong> {record.latestPayroll.lastProcessedDate ? new Date(record.latestPayroll.lastProcessedDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No payroll records available.</p>
                                    )}
                                  
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default LatestPayrollRecords;
