import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Navbar from '../../components/Navbar';
import proposalService from '../../services/proposalService';
import { FormInput, FormTextArea } from '../../components/common/FormComponents';
import toast from 'react-hot-toast';
import './SubmitProposal.css';

const proposalSchema = z.object({
  price: z.coerce.number().min(1, "Price must be at least $1"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
  cover_letter: z.string().min(20, "Cover letter must be at least 20 characters"),
});

export default function SubmitProposal() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      price: '',
      duration: '',
      cover_letter: ''
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await proposalService.sendProposal({ 
        project_id: projectId,
        price: data.price,
        duration: data.duration,
        message: data.cover_letter 
      });
      
      toast.success('Proposal submitted successfully!');
      navigate('/freelancer/my-proposals');
    } catch (err) {
      console.error('Failed to submit proposal', err);
      const backendErrors = err.response?.data?.errors;
      if (backendErrors) {
        Object.keys(backendErrors).forEach((key) => {
          const formKey = key === 'message' ? 'cover_letter' : key;
          setError(formKey, {
            type: "manual",
            message: backendErrors[key][0],
          });
        });
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
      }
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
        <div className="submit-header mb-4">
          <h1 className="h2 fw-bold">Submit Proposal</h1>
          <p className="text-muted">Please enter the details of your offer for this project.</p>
        </div>

        <div className="proposal-form-card shadow-sm p-4 bg-white rounded">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="Your Bid (USD)"
                  name="price"
                  type="number"
                  placeholder="e.g. 500"
                  register={register}
                  error={errors.price}
                  required
                />
              </div>

              <div className="col-md-6">
                <FormInput
                  label="Estimated Time (Days)"
                  name="duration"
                  type="number"
                  placeholder="e.g. 14"
                  register={register}
                  error={errors.duration}
                  required
                />
              </div>
            </div>

            <FormTextArea
              label="Cover Letter"
              name="cover_letter"
              placeholder="Introduce yourself, explain why you're a good fit, and detail how you plan to complete this project..."
              rows={8}
              register={register}
              error={errors.cover_letter}
              required
            />
            <small className="text-muted mt-1 d-block mb-4">
               Write a compelling cover letter. This is your chance to stand out!
            </small>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link to="/freelancer/browse-projects" className="premium-btn premium-btn-secondary text-decoration-none">
                 Cancel
              </Link>
              <button 
                type="submit" 
                className="premium-btn premium-btn-primary px-5 py-2 fw-bold"
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
