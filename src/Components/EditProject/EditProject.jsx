import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../../ContextApi/UserContext";
import { useNavigate } from 'react-router-dom';

const EditProject = () => {
  const { projectId } = useContext(UserContext);

  const { projectName } = useContext(UserContext);
  const navigate = useNavigate(); 

  const [employees, setEmployees] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (projectId) {
          const response = await axios.get(
            `http://localhost:3000/api/v1/projects/${projectId}/employees`
          );
          setEmployees(response.data.employees);
        } else {
          setError("No project selected.");
        }
      } catch (error) {
        setError("Failed to fetch employees.");
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [projectId]);

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

  const handleAssignTask = async () => {
    try {
      if (!assignedEmployees || !taskTitle || !taskDescription || !deadline) {
        alert("Please fill in all fields.");
        return;
      }

      // Check if the deadline date is in the past
      const currentDate = new Date();
      const selectedDeadline = new Date(deadline);

      if (selectedDeadline < currentDate.setHours(0, 0, 0, 0)) {
        alert("The deadline cannot be a past date.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/v1/projects/${projectId}/tasks/new`,
        {
          title: taskTitle,
          description: taskDescription,
          deadline: deadline,
          assignedEmployees: [assignedEmployees],
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Task assigned successfully");
        setTaskTitle("");
        setTaskDescription("");
        setDeadline("");
        setAssignedEmployees("");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      setError("Failed to assign task to the employee.");
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/projects/${projectId}/employee/${employeeId}`
      );
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      setSuccessMessage("Employee removed successfully");
    } catch (error) {
      console.error("Error removing employee:", error);
      setError("Failed to remove employee from the project.");
    }
  };

  const handleAddEmployeeToProject = async () => {
    if (!selectedUser) {
      alert("Please select an employee to add.");
      return;
    }

    const employeeExists = employees.some(
      (employee) => employee.id === selectedUser
    );
    if (employeeExists) {
      alert("Employee already exists in the project.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/projects/${projectId}/employees/new`,
        { employeeId: selectedUser }
      );
      if (response.status === 200) {
        setSuccessMessage("Employee added to the project successfully");
        setEmployees([
          ...employees,
          users.find((user) => user._id === selectedUser),
        ]);
        setSelectedUser("");
      }
    } catch (error) {
      console.error("Error adding employee to the project:", error);
      setError("Failed to add employee to the project.");
    }
  };

  if (loading) return <p className="text-center">Loading employees...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <button
        onClick={() => navigate(-1)} 
        className="  mb-4 mt-10 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
      >
        &larr; 
      </button>
      <h1 className="text-3xl font-bold text-center mb-6">{projectName}</h1>
      <div className="max-w-4xl mx-auto p-6 mt-5 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Remove Employee From {projectName}
        </h1>

        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-black"></h2>
          {employees.length > 0 ? (
            <ul className="list-disc pl-6">
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className="mb-2 flex justify-between items-center"
                >
                  <span>{employee.name}</span>
                  <button
                    onClick={() => handleRemoveEmployee(employee.id)}
                    className="ml-4 px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-600">
              No employees assigned to this project.
            </p>
          )}
        </div>
      </div>

      {/* Flex container for the two cards */}
      <div className="max-w-4xl mx-auto p-6 mt-5 flex gap-6">
        {/* Assign Task Card */}
        <div className="flex-1 bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            Assign a Task to Employee
          </h1>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter Task Title"
            className="border rounded px-2 py-1 text-gray-700 mr-2 mb-2 w-full"
          />
          <input
            type="text"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Enter Task Description"
            className="border rounded px-2 py-1 text-gray-700 mr-2 mb-2 w-full"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 mr-2 mb-2 w-full"
          />
          <select
            value={assignedEmployees}
            onChange={(e) => setAssignedEmployees(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 mr-2 mb-2 w-full"
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignTask}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none w-full"
          >
            Assign Task
          </button>
          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </div>

        {/* Add Employee Card */}
        <div className="flex-1 bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">
            Add Employee to {projectName}
          </h1>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border rounded px-2 py-1 text-gray-700 mr-2 w-full"
          >
            <option value="">Select Employee</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddEmployeeToProject}
            className="px-4 py-2 mt-4 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none w-full"
          >
            Add Employee
          </button>
        </div>
      </div>
    </>
  );
};

export default EditProject;
