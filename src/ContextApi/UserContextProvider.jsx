  import React, { useState } from "react";
  import UserContext from "./UserContext";

  export default function UserContextProvider({ children }) {
    let [projectId, setProjectId] = useState();
    let [projectName, setProjectName] = useState();
    let [idForPayRoll,setIdForPayRoll] = useState();

    let handleProjectId = (ProjectId) => {
      setProjectId(ProjectId);
    };

    let handleProjectName = (projectName) => {
      setProjectName(projectName);
    };

    let handleIdForPayroll = (idForPayRoll) => {
      setIdForPayRoll(idForPayRoll);
    };

    console.log(idForPayRoll)


    return (
      <UserContext.Provider
        value={{
          handleProjectId,
          projectId,
          handleProjectName,
          projectName,
          handleIdForPayroll,
          idForPayRoll

        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
