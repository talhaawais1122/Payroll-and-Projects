import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios';
import Select from 'react-select';

const CreateProject = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [projectId, setProjectId] = useState(null); // State for storing project ID
  const [error, setError] = useState(''); // State for storing validation errors

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) {
      setError("The start date cannot be in the past.");
      return;
    }

    if (endDate <= startDate) {
      setError("The end date must be after the start date.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/v1/projects/create', {
        title,
        description,
        startDate,
        endDate,
        assignedEmployees: assignedEmployees.map(employee => employee.value),
      });

      setMessage(response.data.message);
      setProjectId(response.data.project._id); // Store project ID from response
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAssignedEmployees([]);
      setError(''); // Clear any previous error messages
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (

    <>
      <button
        onClick={() => navigate(-1)} 
        className="  mb-4 mt-10 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
      >
        &larr; 
      </button>

    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
    
      
      <h1 className="text-2xl font-semibold mb-4 text-center">Create Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title:</label>
          <input
            type="text"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Assign Employees:</label>
          <Select
            isMulti
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            value={assignedEmployees}
            onChange={setAssignedEmployees}
            placeholder="Select employees"
          />
        </div>
        <button type="submit" className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500">
          Create Project
        </button>
      </form>
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
    </>
  );

};


export default CreateProject;
