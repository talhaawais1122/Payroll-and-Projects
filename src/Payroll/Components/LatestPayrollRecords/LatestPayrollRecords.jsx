import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LatestPayrollRecords = () => {
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                className="mb-4 mt-10 ml-10 text-4xl text-slate-800"
            >
                &larr;
            </button>
          
            <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
                {payrollRecords.length === 0 ? (
                    <p className="text-center text-gray-500">No payroll records found.</p>
                ) : (
                    payrollRecords.map((record) => (
                        <div key={record.employeeId} className="w-full mb-6 p-6 bg-gray-100 rounded-md shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">{record.name}</h2>
                            {record.latestPayroll ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <p><strong>Salary:</strong> ${record.latestPayroll.salary.toFixed(2)}</p>
                                        <p><strong>Bonuses:</strong> ${record.latestPayroll.bonuses.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p><strong>Deductions:</strong> ${record.latestPayroll.deductions.toFixed(2)}</p>
                                        <p><strong>From:</strong> {record.latestPayroll.from ? new Date(record.latestPayroll.from).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p><strong>To:</strong> {record.latestPayroll.to ? new Date(record.latestPayroll.to).toLocaleDateString() : 'N/A'}</p>
                                        <p><strong>Processed on:</strong> {record.latestPayroll.lastProcessedDate ? new Date(record.latestPayroll.lastProcessedDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No payroll records available.</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default LatestPayrollRecords;
