import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PayrollRecordsByMonth = () => {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.get(`http://localhost:3000/api/v1/payroll/monthly`, {
                params: { month, year, status: 'latest' } 
            });

            setPayrollRecords(response.data.payrollRecords);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch payroll records');
        } finally {
            setLoading(false);
        }
    };

    const handleMonthlyRecord = () => {
        navigate('/payroll/byMonths/SingleEmployee');
    };

    return (
        <>
           <div className='flex justify-between items-center m-5'>
    <button
        onClick={() => navigate(-1)} 
        className="text-4xl text-slate-800"
    >
        &larr;
    </button>
    <button 
        className="bg-orange-600 text-right text-white px-4 py-2 rounded-md hover:bg-orange-700"
        onClick={handleMonthlyRecord}
    >
        Single Employee
    </button>
</div>

           
        
            <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-semibold text-center mb-6">Payroll Records By Month</h1>
                <form onSubmit={handleSubmit} className="space-y-3 min-w-full size-50">
                    <div>
                        <label htmlFor="month"  className="block font-medium text-gray-700">Month</label>
                        <input
                            type="number"
                            id="month"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                            className="mt-5 block w-full border-black size-15 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="year" className="block t font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            className="mt-5 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mr-10 py-2 px-4 bg-orange-600 text-white rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
                    >
                        {loading ? 'Fetching...' : 'Get Payroll Records'}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-600">{error}</p>}
                {success && <p className="mt-4 text-green-600">Success! Payroll records fetched.</p>}

                {payrollRecords.length > 0 && (
                    <div className="mt-6 bg-gray-100 p-4 rounded-md shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">Payroll Records for {month}/{year}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {payrollRecords.map((record) => (
                                <div key={record.employeeId} className="w-full p-4 bg-white rounded-md shadow-sm">
                                    <h3 className="text-lg font-semibold">{record.name}</h3>
                                    {record.payroll.map((pay, index) => (
                                        <div key={index} className="mt-2">
                                            <p><strong>Salary:</strong> ${pay.salary.toFixed(2)}</p>
                                            <p><strong>Bonuses:</strong> ${pay.bonuses}</p>
                                            <p><strong>Deductions:</strong> ${pay.deductions}</p>
                                            <p><strong>From:</strong> {new Date(pay.from).toLocaleDateString()}</p>
                                            <p><strong>To:</strong> {new Date(pay.to).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PayrollRecordsByMonth;