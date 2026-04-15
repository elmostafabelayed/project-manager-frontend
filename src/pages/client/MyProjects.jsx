import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import './MyProjects.css';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getMyProjects();
        setProjects(data.data || data);
      } catch (error) {
        console.error("Failed to fetch my projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#185fa5',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    try {
      await projectService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="bg-background min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold text-dark-blue">My Projects</h1>
          <Link to="/client/create-project" className="cl-btn-primary text-decoration-none">
            + Post New Project
          </Link>
        </div>

        {loading ? (
          <div className="text-center p-5"><div className="cl-spinner"></div></div>
        ) : projects.length === 0 ? (
          <div className="empty-state-card text-center p-5 bg-white shadow-sm rounded-3">
            <h3 className="text-secondary">You haven't posted any projects yet.</h3>
            <p className="mb-4">Start your journey by posting your first job offer.</p>
            <Link to="/client/create-project" className="cl-btn-primary d-inline-block text-decoration-none">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {projects.map(project => (
              <div key={project.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm project-card-hover">
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                       <span className={`badge ${project.status === 'open' ? 'bg-success' : 'bg-secondary'}`}>
                         {project.status || 'open'}
                       </span>
                       <span className="fw-bold text-primary">${project.budget}</span>
                    </div>
                    <h3 className="h5 fw-bold mb-3">{project.title}</h3>
                    <p className="text-muted small mb-4 flex-grow-1">
                      {project.description.substring(0, 100)}...
                    </p>
                    <div className="mt-auto pt-3 border-top d-flex justify-content-between">
                       <Link to={`/client/projects/${project.id}/proposals`} className="btn btn-sm btn-outline-primary">
                          View Proposals
                       </Link>
                       <button onClick={() => handleDelete(project.id)} className="btn btn-sm btn-link text-danger p-0">
                          Delete
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
