import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../../ContextApi/UserContext";

const Header = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate("/createProject");
  };
  const handleOldProjects =()=>{
    navigate("/oldProjects");
  }

  return (
    <div className="flex justify-between items-center p-4shadow-lg mt-5">

<button
        onClick={handleOldProjects}
        className="bg-orange-600 text-red-50 font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-colors"
      >
        Old Projects 
      </button>
      <h1 className="text-3xl text-center font-bold">Projects Dashboard</h1>
      
      <button
        onClick={handleCreateProject}
        className="bg-orange-600 text-red-50 font-semibold py-2 px-4 rounded hover:bg-orange-500 transition-colors"
      >
        Create New Projects
      </button>
    </div>
  );
};

const ProjectDashboard = () => {
  const [currentProjects, setCurrentProjects] = useState([]);
  // const [oldProjects, setOldProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { handleProjectId } = useContext(UserContext);
  const {handleProjectName} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const currentResponse = await axios.get(
          "http://localhost:3000/api/v1/projects?status=current"
        );
        setCurrentProjects(currentResponse.data.projects || []);

    
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
    <div className="max-w-7xl mx-auto">
      <Header />
      <div className="p-6">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Current Projects
          </h2>
          {currentProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  handleProjectName={handleProjectName}
                  handleProjectId={handleProjectId}
                  navigate={navigate}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No current projects found.
            </p>
          )}
        </section>

   
      </div>
    </div>
  );
};

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

export default ProjectDashboard;
