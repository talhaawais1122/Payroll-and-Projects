import React from 'react'
import  { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../ContextApi/UserContext";





export default function OldProjects() {

    const [oldProjects, setOldProjects] = useState([]);
     const [loading, setLoading] = useState(true);
     const { handleProjectId } = useContext(UserContext);
     const {handleProjectName} = useContext(UserContext);
     const navigate = useNavigate();


     
  useEffect(() => {
    const fetchProjects = async () => {
      try {
    
        const oldResponse = await axios.get(
          "http://localhost:3000/api/v1/projects?status=old"
        );
        setOldProjects(oldResponse.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-center">Loading projects...</p>;



    

    return (
        <>
           <button
        onClick={() => navigate(-1)} 
        className="  mb-4 mt-10 ml-10 start-2 from-neutral-800 text-4xl text-slate-800 size-medium"
      >
        &larr; 
      </button>
        
         <div className="max-w-7xl mx-auto">
  
      <div className="p-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Old Projects
          </h2>
          {oldProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {oldProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  handleProjectId={handleProjectId}
                  handleProjectName={handleProjectName}
                  navigate={navigate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No old projects found.</p>
          )}
        </section>
      </div>
    </div>
            
        </>
    )
}
const ProjectCard = ({ project, handleProjectId, navigate ,handleProjectName }) => {
    const handleButtonClick = () => {
      handleProjectId(project.id);
      handleProjectName(project.title);
      navigate("/editProject");
    };
  
    return (
      <div className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold mb-2 text-black">
          {project.title}
        </h2>
        <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
        <p className="text-gray-600"></p>
        <p className="text-gray-600">
          <strong>Start Date:</strong>{" "}
          {new Date(project.startDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          <strong>End Date:</strong>{" "}
          {new Date(project.endDate).toLocaleDateString()}
        </p>
  
        <button
          onClick={handleButtonClick}
          className="mt-4 w-full py-2 bg-orange-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Edit Project
        </button>
      </div>
    );
  };