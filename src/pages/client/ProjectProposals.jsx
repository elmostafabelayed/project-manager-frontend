import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import toast from 'react-hot-toast';
import './ProjectProposals.css';

export default function ProjectProposals() {
  const { id } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        // Assuming backend returns { data: [...] } or just the array
        const responseList = await proposalService.getProjectProposals(id);
        const data = responseList.data || responseList;
        setProposals(data);
        setError(null);
      } catch (err) {
        setError('Error loading proposals. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [id]);

  const handleAccept = async (proposalId) => {
    try {
      setAcceptingId(proposalId);
      await proposalService.acceptProposal(proposalId);
      
      // Update local state to reflect accepted status
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'accepted' } : p
      ));
      
      toast.success('Proposal accepted successfully! A contract and conversation have been created.');
    } catch (err) {
      console.error('Error accepting proposal:', err);
      toast.error('Failed to accept proposal.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="proposals-container container">
        <div className="proposals-header">
          <Link to="/client/dashboard" className="back-link mb-3 d-inline-block text-decoration-none">← Back to Dashboard</Link>
          <h1>Project Proposals</h1>
          <p>Review and accept offers from freelancers.</p>
        </div>

        {loading ? (
          <div className="cl-loading-state text-center p-5">
             <div className="cl-spinner"></div>
             <p className="mt-3">Loading proposals...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : proposals.length === 0 ? (
          <div className="empty-state">
             <p>No proposals have been submitted for this project yet.</p>
          </div>
        ) : (
          <div className="proposals-list">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="proposal-card">
                <div className="freelancer-info">
                   <Link to={`/shared/profile/${proposal.freelancer_id}`}>
                     <img 
                       src={`https://ui-avatars.com/api/?name=${proposal.freelancer?.name || 'Freelancer'}&background=185fa5&color=fff`} 
                       alt="freelancer" 
                       className="freelancer-avatar" 
                     />
                   </Link>
                   <div className="freelancer-details">
                     <h3>
                       <Link to={`/shared/profile/${proposal.freelancer_id}`} className="text-decoration-none text-dark">
                         {proposal.freelancer?.name || 'Unknown Freelancer'}
                       </Link>
                     </h3>
                     <p>Completed Jobs: {proposal.freelancer?.completed_jobs || 0}</p>
                   </div>
                </div>

                <div className="proposal-details">
                  <div className="detail-item">
                    <span className="detail-label">Bid Amount</span>
                    <span className="detail-value">${proposal.price}</span>
                  </div>
                  <div className="detail-item text-end">
                    <span className="detail-label">Delivery Time</span>
                    <span className="detail-value">{proposal.duration} days</span>
                  </div>
                </div>

                <div className="proposal-cover-letter">
                  <h4>Cover Letter:</h4>
                  <p>{proposal.cover_letter}</p>
                </div>

                <div className="proposal-actions">
                  {proposal.status === 'accepted' ? (
                     <span className="accepted-badge text-center w-100 py-2 block">Accepted</span>
                  ) : (
                     <>
                      <button 
                        className="btn-accept" 
                        onClick={() => handleAccept(proposal.id)}
                        disabled={acceptingId === proposal.id}
                      >
                        {acceptingId === proposal.id ? 'Accepting...' : 'Accept Offer'}
                      </button>
                      {/* Note: we might want a full view to read the entire cover letter */}
                      <button className="btn-view">View Details</button>
                     </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
