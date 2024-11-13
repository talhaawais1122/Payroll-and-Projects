import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../../ContextApi/UserContext';

const PayrollForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [payrollDetails, setPayrollDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { handleIdForPayroll } = useContext(UserContext);
    const navigate = useNavigate();

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `http://localhost:3000/api/v1/payroll/process`,
                { startDate, endDate },
                { params: { employeeId } }
            );

            setPayrollDetails(response.data.payrollDetails);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process payroll');
        } finally {
            setLoading(false);
        }
    };

    const handleGetDetails = (id) => {
        handleIdForPayroll(id);
        navigate(`/payroll/employee/${id}`);
    };

    const handleProcessPay = () => {
        navigate('/payroll/latestRecords');
    };
    
    const handleMonthlyRecord = () => {
        navigate('/payroll/monthlyRecords');
    };
    
    const handleSingleEmployee = () => {
        navigate('/payroll/generatePayroll');
    };

    return (
        <>
            <button
                onClick={() => navigate(-1)} 
                className="mt-5 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
            >
                &larr; 
            </button>

            <div className="flex justify-between items-center m-10">
                <button 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                    onClick={handleMonthlyRecord}
                >
                    Monthly Records 
                </button>
                
                <button 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                    onClick={handleSingleEmployee}
                >
                    Generate Payroll For Single Employee
                </button>
               
                <button 
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                    onClick={handleProcessPay}
                >
                    Latest Records 
                </button>
            </div>
        
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-center mb-6">Generate Payroll for All Employees</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={currentDate}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            max={currentDate}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID (Optional)</label>
                        <input
                            type="text"
                            id="employeeId"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="Enter Employee ID"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-orange-600 text-white rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                    >
                        {loading ? 'Processing...' : 'Process Payroll'}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-600">{error}</p>}

                {payrollDetails && (
                    <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <h2 className="text-xl font-semibold mb-2 col-span-full">Payroll Details</h2>
                        {payrollDetails.map((payroll) => (
                            <div
                                key={payroll.employeeId}
                                className="p-4 bg-white rounded-md shadow-md border"
                            >
                                <h3 className="text-lg font-semibold mb-2">{payroll.name}</h3>
                                <p><strong>Employee ID:</strong> {payroll.employeeId}</p>
                                <p><strong>Total Hours:</strong> {payroll.totalWorkingHours}</p>
                                <p><strong>Hourly Rate:</strong> ${payroll.hourlyRate}</p>
                                <p><strong>Salary:</strong> ${payroll.calculatedSalary.toFixed(2)}</p>
                                <button
                                    onClick={() => handleGetDetails(payroll.employeeId)}
                                    className="mt-4 py-1 px-3 bg-orange-600 text-white rounded-md shadow-sm hover:bg-orange-600"
                                >
                                    Get Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PayrollForm;
