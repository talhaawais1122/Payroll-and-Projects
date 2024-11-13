import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

export default function UserContextProvider({ children }) {
    // Initialize state from localStorage if available
    const [projectId, setProjectId] = useState(() => {
        return localStorage.getItem("projectId") || "";
    });
    const [projectName, setProjectName] = useState(() => {
        return localStorage.getItem("projectName") || "";
    });
    const [idForPayRoll, setIdForPayRoll] = useState(() => {
        return localStorage.getItem("idForPayRoll") || "";
    });

    
    useEffect(() => {
        localStorage.setItem("projectId", projectId);
    }, [projectId]);

    useEffect(() => {
        localStorage.setItem("projectName", projectName);
    }, [projectName]);

    useEffect(() => {
        localStorage.setItem("idForPayRoll", idForPayRoll);
    }, [idForPayRoll]);

    const handleProjectId = (ProjectId) => {
        setProjectId(ProjectId);
    };

    const handleProjectName = (projectName) => {
        setProjectName(projectName);
    };

    const handleIdForPayroll = (idForPayRoll) => {
        setIdForPayRoll(idForPayRoll);
    };

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
