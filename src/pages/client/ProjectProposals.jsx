import usePagedCollection from '../../hooks/usePagedCollection';
import Pagination from '../../components/Pagination';
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import proposalService from '../../services/proposalService';
import toast from 'react-hot-toast';
import { getAvatarUrl } from '../../utils/avatarHelper';
import './ProjectProposals.css';

export default function ProjectProposals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: proposals, loading, error, pagination, setPage, refresh } = usePagedCollection(`/projects/${id}/proposals`);
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const handleAccept = async (proposalId) => {
    try {
      setAcceptingId(proposalId);
      await proposalService.acceptProposal(proposalId);

      toast.success('Proposal accepted! The project is now active.');
      navigate('/client/dashboard');
    } catch (err) {
      console.error('Error accepting proposal:', err);
      toast.error('Failed to accept proposal.');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (proposalId) => {
    try {
      setRejectingId(proposalId);
      await proposalService.rejectProposal(proposalId);

      refresh();
      toast.success('Offer cancelled successfully.');
    } catch (err) {
      console.error('Error rejecting proposal:', err);
      toast.error('Failed to cancel offer.');
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="dashboard-container">

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
                       src={getAvatarUrl(proposal.freelancer)}
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
                  <p>{proposal.response_message || proposal.message}</p>

                  {proposal.response_message && (
                    <div className="original-invitation mt-3 p-2 bg-light rounded shadow-sm border-start border-primary border-4">
                      <small className="text-muted d-block mb-1 fw-bold">Your Original Invitation:</small>
                      <p className="mb-0 small italic">"{proposal.message}"</p>
                    </div>
                  )}
                </div>

                <div className="proposal-actions">
                  {proposal.status === 'accepted' ? (
                     <span className="accepted-badge text-center w-100 py-2 block">Accepted</span>
                  ) : proposal.status === 'rejected' ? (
                     <span className="rejected-badge text-center w-100 py-2 block text-danger fw-bold border border-danger rounded">Cancelled</span>
                  ) : (
                     <>
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(proposal.id)}
                        disabled={acceptingId === proposal.id || rejectingId === proposal.id}
                      >
                        {acceptingId === proposal.id ? 'Accepting...' : 'Accept Offer'}
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() => handleReject(proposal.id)}
                        disabled={rejectingId === proposal.id || acceptingId === proposal.id}
                      >
                        {rejectingId === proposal.id ? 'Cancelling...' : 'Cancel Offer'}
                      </button>
                     </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} onPageChange={setPage} loading={loading} />
      </div>
    </div>
  );
}
