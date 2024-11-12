import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import ProjectDashboard from './Components/ProjectDashbord/ProjectDashboard.jsx';
import EditProject from './Components/EditProject/EditProject.jsx';
import CreateProject from './Components/CreateProject/CreateProject .jsx'; // Import CreateProject component
import OldProjects from './Components/Oldprojects/OldProjects.jsx';
import PayrollForm from './Payroll/Components/GenratePayrollFormForAllEmployee/GenratePayrollFormForAllEmployee.jsx';
import LatestPayrollRecords from './Payroll/Components/LatestPayrollRecords/LatestPayrollRecords.jsx';
import PayrollRecordsByMonth from './Payroll/Components/PayRollByMonth/PayRollByMonth.jsx'
import GetDetailsForSingleEmployee from './Payroll/Components/GetDetailsForSingleEmployee/GetDetailsForSingleEmployee.jsx';
import PayRollForMonthSingleEmployee from './Payroll/Components/PayRollForMonthSingleEmployee/PayRollForMonthSingleEmployee.jsx';
import GenratePayRollForSingleEmployee from './Payroll/Components/GenratePayRollForSingleEmployee/GenratePayRollForSingleEmployee.jsx';

const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />, 
    children: [
      {
        path: 'projectdashbord', 
        element: <ProjectDashboard />
      },
      {
        path: 'editProject', 
        element: <EditProject />
      },
      {
        path: 'oldProjects', 
        element: <OldProjects/>
      },
      {
        path: 'createProject',
        element: <CreateProject /> // Correct the component reference
      },
      {
        path: 'payroll',
        element: <PayrollForm />
      },
      {
        path: 'payroll/latestRecords',
        element: <LatestPayrollRecords />
      },
      {
        path: 'payroll/monthlyRecords',
        element: <PayrollRecordsByMonth />
      },
      {
        path: 'payroll/employee/:employeeId',
        element: <GetDetailsForSingleEmployee />
      },
      {
        path: 'payroll/byMonths/SingleEmployee',
        element: <PayRollForMonthSingleEmployee />
      },
      {
        path: 'payroll/generatePayroll',
        element: <GenratePayRollForSingleEmployee />  
      }
      // {
      //   path: 'payroll/monthlyRecords',
      //   element: <PayrollRecordsByMonth />
      // },


      // Add more routes as needed for your app.

      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
