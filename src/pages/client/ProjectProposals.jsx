import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import { createProjectFromProposal } from '../../store/slices/projectSlice';
import toast from 'react-hot-toast';
import './ProjectProposals.css';

export default function ProjectProposals() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: projectLoading } = useSelector((state) => state.projects);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

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
      
      const acceptedProposal = proposals.find(p => p.id === proposalId);
      const projectData = {
        proposal_id: proposalId,
        title: acceptedProposal?.project?.title || `Project from Proposal ${proposalId}`,
        description: acceptedProposal?.project?.description || '',
        budget: acceptedProposal?.price || 0,
      };
      
      await dispatch(createProjectFromProposal(projectData));
      
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'accepted' } : p
      ));
      
      toast.success('Proposal accepted! Project created successfully.');
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
      
      setProposals(proposals.map(p => 
        p.id === proposalId ? { ...p, status: 'rejected' } : p
      ));
      
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
                        disabled={acceptingId === proposal.id || rejectingId === proposal.id || projectLoading}
                      >
                        {acceptingId === proposal.id ? 'Accepting...' : projectLoading ? 'Creating Project...' : 'Accept Offer'}
                      </button>
                      {/* Note: we might want a full view to read the entire cover letter */}
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
      </div>
    </div>
  );
}
