import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import './MyProposals.css';

export default function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'pending': return 'bg-warning text-dark';
      default: return 'bg-info';
    }
  };

  return (
    <div className="bg-background min-vh-100">
      <Navbar />
      <div className="container py-5">
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
                      <span className={`badge ${getStatusBadgeClass(proposal.status)}`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td>{new Date(proposal.created_at).toLocaleDateString()}</td>
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
