import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import toast from 'react-hot-toast';
import './SubmitProposal.css';

export default function SubmitProposal() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    price: '',
    duration: '',
    cover_letter: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.price || !formData.duration || !formData.cover_letter) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // The backend expects 'message' instead of 'cover_letter' based on the SQL error.
      await proposalService.sendProposal({ 
        project_id: projectId,
        price: formData.price,
        duration: formData.duration,
        message: formData.cover_letter 
      });
      
      toast.success('Proposal submitted successfully!');
      navigate('/freelancer/my-proposals'); // Redirect to my-proposals page
    } catch (err) {
      console.error('Failed to submit proposal', err);
      // Backend might return validation errors like 422
      setError(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container bg-background min-vh-100 mt-5">
      <Navbar />
      <div className="submit-proposal-container container py-5">
        <Link to="/freelancer/browse-projects" className="back-link mb-3 d-inline-block text-decoration-none">
          ← Back to Projects
        </Link>
        <div className="submit-header">
          <h1>Submit Proposal</h1>
          <p>Please enter the details of your offer for this project.</p>
        </div>

        <div className="proposal-form-card">
          {error && !error.errors && <div className="alert alert-danger mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="price">Your Bid (USD)</label>
                <div className="input-icon-wrapper">
                   <input
                     type="number"
                     id="price"
                     name="price"
                     className={`form-control input-with-icon ${error?.errors?.price ? 'input-error' : ''}`}
                     placeholder="e.g. 500"
                     value={formData.price}
                     onChange={handleInputChange}
                     min="1"
                   />
                </div>
                {error?.errors?.price && <span className="field-error">{error.errors.price[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="duration">Estimated Time (Days)</label>
                <div className="input-icon-wrapper">
                   <input
                     type="number"
                     id="duration"
                     name="duration"
                     className={`form-control input-with-icon ${error?.errors?.duration ? 'input-error' : ''}`}
                     placeholder="e.g. 14"
                     value={formData.duration}
                     onChange={handleInputChange}
                     min="1"
                   />
                </div>
                {error?.errors?.duration && <span className="field-error">{error.errors.duration[0]}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cover_letter">Cover Letter</label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                className={`form-control ${error?.errors?.message ? 'input-error' : ''}`}
                placeholder="Introduce yourself, explain why you're a good fit, and detail how you plan to complete this project..."
                value={formData.cover_letter}
                onChange={handleInputChange}
                rows="6"
              />
              {error?.errors?.message && <span className="field-error">{error.errors.message[0]}</span>}
              <small className="text-muted mt-2 d-block">
                 Write a compelling cover letter. This is your chance to stand out!
              </small>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link to="/freelancer/browse-projects" className="text-secondary text-decoration-none">
                 Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-submit w-auto px-5"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Send Proposal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
