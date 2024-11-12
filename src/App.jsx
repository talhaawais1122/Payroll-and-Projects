import { useState } from "react";
import ProjectDashboard from "./Components/ProjectDashbord/ProjectDashboard";
import { Outlet } from "react-router-dom";
import UserContextProvider from "./ContextApi/UserContextProvider"; // Correct path to UserContextProvider

function App() {
  return (
    <UserContextProvider>
    <Outlet />
  </UserContextProvider>
  );
}

export default App;
