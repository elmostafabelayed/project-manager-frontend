import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
      await api.delete(`/admin/projects/${id}`);
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
        <h1 className="fw-bold mb-4">Manage Projects</h1>
        
        {loading ? (
          <div className="text-center p-5"><div className="cl-spinner"></div></div>
        ) : (
          <div className="table-responsive bg-white shadow-sm rounded-3 p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.title}</td>
                    <td>{project.client?.name || 'Unknown'}</td>
                    <td><span className="fw-bold text-success">${project.budget}</span></td>
                    <td>
                       <span className={`badge ${project.status === 'open' ? 'bg-primary' : 'bg-secondary'}`}>
                          {project.status || 'open'}
                       </span>
                    </td>
                    <td>{new Date(project.created_at).toLocaleDateString()}</td>
                    <td>
                       <button onClick={() => handleDelete(project.id)} className="btn btn-sm btn-outline-danger">
                          Delete
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
