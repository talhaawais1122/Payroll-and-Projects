import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

export default function GenratePayRollForSingleEmployee() {
    const [users, setUsers] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [payrollDetails, setPayrollDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/users/");
                setUsers(response.data.employees);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const handleEmployeeChange = (selectedOption) => {
        setAssignedEmployees(selectedOption || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!assignedEmployees) {
            setError("Please select an employee.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `http://localhost:3000/api/v1/payroll/process?employeeId=${assignedEmployees.value}`,
                {
                    startDate: startDate,
                    endDate: endDate
                }
            );
            setPayrollDetails(response.data.payrollDetails);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process payroll');
        } finally {
            setLoading(false);
        }
    };

    return (


        <>
              <button
        onClick={() => navigate(-1)} 
        className="   mt-5 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
      >
        &larr; 
      </button>
         <div className="max-w-98 mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-center mb-6">Generate Payroll for Single Employee</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                    <Select
                        options={users.map((user) => ({
                            value: user._id,
                            label: user.name,
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        value={assignedEmployees}
                        onChange={handleEmployeeChange}
                        placeholder="Select an employee"
                    />
                </div>

                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
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
                        required
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
                <div className="mt-6 w-full grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <h2 className="text-xl w-full font-semibold mb-2 col-span-full">Payroll Details</h2>
                    {payrollDetails.map((payroll) => (
                        <div
                            key={payroll.employeeId}
                            className="p-4 w-96 bg-white rounded-md shadow-md border"
                        >
                            <h3 className="text-lg font-semibold mb-2">{payroll.name}</h3>
                            <p><strong>Employee ID:</strong> {payroll.employeeId}</p>
                            <p><strong>Total Hours:</strong> {payroll.totalWorkingHours}</p>
                            <p><strong>Hourly Rate:</strong> ${payroll.hourlyRate}</p>
                            <p><strong>Salary:</strong> ${payroll.calculatedSalary.toFixed(2)}</p>
                            <button
                               
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
}
