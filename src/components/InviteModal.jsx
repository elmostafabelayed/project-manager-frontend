import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import projectService from '../services/projectService';
import proposalService from '../services/proposalService';
import toast from 'react-hot-toast';
import './InviteModal.css';

export default function InviteModal({ freelancer, onClose }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [message, setMessage] = useState(`Hi ${freelancer.name}, I'm impressed with your profile and would like to invite you to bid on my project.`);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getMyProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load your projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }
    if (message.length < 10) {
      toast.error('Message must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);
      await proposalService.inviteFreelancer({
        project_id: selectedProjectId,
        freelancer_id: freelancer.id,
        message: message
      });
      toast.success('Invitation sent successfully!');
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error(error.response?.data?.message || 'Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal-content card border-0 shadow">
        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4 px-4">
          <h5 className="fw-bold mb-0">Invite {freelancer.name}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="card-body p-4">
          <p className="text-muted small mb-4">
            Select one of your projects to invite this freelancer to bid.
          </p>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading projects...</span>
              </div>
            </div>
          ) : projects.length > 0 ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Select Project</label>
                <select 
                  className="form-select" 
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Invitation Message</label>
                <textarea 
                  className="form-control" 
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message to the freelancer..."
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button 
                  type="submit" 
                  className="btn btn-primary rounded-pill py-2"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="mb-3">You don't have any active projects.</p>
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill"
                onClick={() => window.location.href = '/client/create-project'}
              >
                Create a Project First
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
