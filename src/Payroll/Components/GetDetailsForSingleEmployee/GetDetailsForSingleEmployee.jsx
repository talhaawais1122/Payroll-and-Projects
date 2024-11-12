import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from '../../../ContextApi/UserContext';
import { useNavigate } from 'react-router-dom';

const GetDetailsForSingleEmployee = () => {
    const { idForPayRoll } = useContext(UserContext);
    const navigate = useNavigate(); // Correctly initialize useNavigate
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEmployeeDetails = async () => {
        if (!idForPayRoll || !startDate || !endDate) {
            setError("Start date and end date are required.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `http://localhost:3000/api/v1/payroll/process?employeeId=${idForPayRoll}`,
                { startDate, endDate } // Pass dates in the request body
            );
            setEmployeeDetails(response.data.payrollDetails[0]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch employee details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, [idForPayRoll, startDate, endDate]); // Run effect when dates or ID change

    if (!idForPayRoll) {
        return <p>Please select an employee to view details.</p>;
    }

    return (
        <>
            <button
                onClick={() => navigate(-1)} 
                className="mb-4 mt-10 ml-10 text-4xl text-slate-800"
            >
                &larr; 
            </button>
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-center mb-6">Employee Payroll Details</h1>
                <div className="mb-4">
                    <label className="block text-gray-700">Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button onClick={fetchEmployeeDetails} className="w-full p-2 bg-orange-600 text-white rounded">Get Payroll Details</button>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {employeeDetails && (
                    <div className="p-4 bg-gray-100 rounded-md shadow-sm">
                        <h2 className="text-lg font-semibold">{employeeDetails.name}</h2>
                        <p><strong>Employee ID:</strong> {employeeDetails.employeeId}</p>
                        <p><strong>Total Hours:</strong> {employeeDetails.totalWorkingHours}</p>
                        <p><strong>Hourly Rate:</strong> ${employeeDetails.hourlyRate}</p>
                        <p><strong>Calculated Salary:</strong> ${employeeDetails.calculatedSalary.toFixed(2)}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default GetDetailsForSingleEmployee;
