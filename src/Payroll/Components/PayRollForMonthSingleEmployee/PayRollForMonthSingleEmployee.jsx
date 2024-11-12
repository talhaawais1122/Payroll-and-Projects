import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

export default function PayRollForMonthSingleEmployee() {
    const [users, setUsers] = useState([]);
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [payrollDetails, setPayrollDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const employeeIds = assignedEmployees.map(emp => emp.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!month || !year || assignedEmployees.length === 0) {
            setError('Please fill all the fields and select at least one employee.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:3000/api/v1/payroll/monthly?month=${month}&year=${year}&employeeId=${employeeIds.join(',')}&status=latest`
            );

            // Accessing payrollRecords from the response
            setPayrollDetails(response.data.payrollRecords);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process payroll');
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeChange = (selectedOptions) => {
        setAssignedEmployees(selectedOptions || []);
    };

    return (
        <div className="p-4 w-full mx-auto">
         <h1 className="text-lg font-medium text-gray-900">Payroll of latest Month for single Employee</h1>
         <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Assign Employees</label>
                    <Select
                        isMulti
                        options={users.map((user) => ({
                            value: user._id,
                            label: user.name,
                        }))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        value={assignedEmployees}
                        onChange={handleEmployeeChange}
                        placeholder="Select employees"
                    />
                </div>

                <div>
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                    <select
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Month</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('en', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                    <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="">Select Year</option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={2015 + i}>
                                {2015 + i}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-orange-600 text-white rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                >
                    {loading ? 'Processing...' : 'Process Payroll'}
                </button>
            </form>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {payrollDetails.length > 0 && (
                <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <h2 className="text-xl font-semibold mb-2 col-span-full">Payroll Details</h2>
                    {payrollDetails.map((payroll) => (
                        <div key={payroll.employeeId} className="p-4 bg-white rounded-md shadow-md border">
                            <h3 className="text-lg font-semibold mb-2">{payroll.name}</h3>
                            <p><strong>Employee ID:</strong> {payroll.employeeId}</p>
                            <p><strong>Total Hours:</strong> {payroll.totalWorkingHours}</p>
                            {payroll.payroll.length > 0 && (
                                <>
                                    <p><strong>Salary:</strong> ${payroll.payroll[0].salary}</p>
                                    <p><strong>Bonuses:</strong> ${payroll.payroll[0].bonuses}</p>
                                    <p><strong>Deductions:</strong> ${payroll.payroll[0].deductions}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

         
        </div>
    );
}
