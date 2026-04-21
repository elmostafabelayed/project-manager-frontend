import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import toast from 'react-hot-toast';
import './MyProposals.css';

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [formData, setFormData] = useState({ price: '', duration: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyProposals = async () => {
      try {
        setLoading(true);
        const data = await proposalService.getMyProposals();
        setProposals(data.data || data);
      } catch (error) {
        console.error("Failed to fetch my proposals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProposals();
  }, []);

  const handleRespondClick = (proposal) => {
    setSelectedProposal(proposal);
    setShowRespondModal(true);
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price || !formData.duration) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await proposalService.respondToInvitation(selectedProposal.id, formData);
      toast.success('Response sent successfully!');
      setShowRespondModal(false);
      // Refresh list
      const updatedProposals = await proposalService.getMyProposals();
      setProposals(updatedProposals.data || updatedProposals);
    } catch (error) {
      console.error('Error responding to invitation:', error);
      toast.error('Failed to send response');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'pending': return 'bg-warning text-dark';
      case 'invited': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="bg-background min-vh-100 mt-5">
      <Navbar />
      <div className="container py-5">
        <Link to="/freelancer/dashboard" className="back-link mb-3 d-inline-block text-decoration-none">
          ← Back to Dashboard
        </Link>
        <h1 className="fw-bold mb-4 text-dark-blue">My Proposals</h1>

        {loading ? (
          <div className="text-center p-5"><div className="cl-spinner"></div></div>
        ) : proposals.length === 0 ? (
          <div className="empty-state-card text-center p-5 bg-white shadow-sm rounded-3">
             <h3 className="text-secondary">You haven't sent any proposals yet.</h3>
             <p className="mb-4">Go to the browse projects page to find your next gig!</p>
             <a href="/freelancer/browse-projects" className="cl-btn-primary d-inline-block text-decoration-none">
                Browse Projects
             </a>
          </div>
        ) : (
          <div className="table-responsive bg-white shadow-sm rounded-3 p-3">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Budget Bid</th>
                  <th>Estimated Duration</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(proposal => (
                  <tr key={proposal.id}>
                    <td>
                      <span className="fw-bold text-dark">{proposal.project?.title || 'Unknown Project'}</span>
                    </td>
                    <td>
                      <Link to={`/shared/profile/${proposal.project?.client?.id}`} className="text-decoration-none">
                        {proposal.project?.client?.name || 'Client'}
                      </Link>
                    </td>
                    <td><span className="text-success fw-bold">${proposal.price}</span></td>
                    <td>{proposal.duration} days</td>
                    <td>
                      <div className="d-flex align-items-center gap-1 flex-wrap">
                        <span className={`badge ${getStatusBadgeClass(proposal.status)}`}>
                          {proposal.status}
                        </span>
                        {proposal.source === 'client' && (
                          <span className="badge bg-purple ms-1">Invitation</span>
                        )}
                        {proposal.status === 'invited' && (
                          <button 
                            className="btn btn-sm btn-primary rounded-pill ms-2"
                            onClick={() => handleRespondClick(proposal)}
                          >
                            Respond
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{new Date(proposal.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRespondModal && (
        <div className="invite-modal-overlay">
          <div className="invite-modal-content card border-0 shadow">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4 px-4">
              <h5 className="fw-bold mb-0">Respond to Invitation</h5>
              <button className="btn-close" onClick={() => setShowRespondModal(false)}></button>
            </div>
            <div className="card-body p-4">
              <p className="text-muted small mb-4">
                Enter your bid details for "<strong>{selectedProposal?.project?.title}</strong>".
              </p>
              <form onSubmit={handleResponseSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Bid ($)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Estimated Time (Days)</label>
                  <input 
                    type="number" 
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 7"
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary rounded-pill py-2" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Submit Bid'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
