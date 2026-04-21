import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProject } from '../../store/slices/projectSlice';
import { categories } from '../../utils/categoryConstants';
import Navbar from '../../components/Navbar';
import { FormInput, FormTextArea, FormSelect } from '../../components/common/FormComponents';
import toast from 'react-hot-toast';
import './CreateProject.css';

const projectSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  budget: z.coerce.number().min(5, "Budget must be at least $5"),
});

export default function CreateProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.projects);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      budget: '',
    },
  });

  // Handle backend errors
  useEffect(() => {
    if (error?.errors) {
      Object.keys(error.errors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: error.errors[key][0],
        });
      });
    } else if (error) {
      toast.error(error.message || "Failed to create project");
    }
  }, [error, setError]);

  const onSubmit = async (data) => {
    const result = await dispatch(createProject(data));
    if (createProject.fulfilled.match(result)) {
      toast.success("Project posted successfully!");
      navigate('/client/dashboard');
    }
  };

  return (
    <div className="create-project-container">
      <Navbar />
      
      <main className="create-project-main container mt-5 pt-4">
        <Link to="/client/dashboard" className="back-link mb-3 d-inline-block text-decoration-none">
          ← Back to Dashboard
        </Link>
        <div className="form-card shadow-sm p-4 bg-white rounded">
          <header className="form-header mb-4">
            <h1 className="h3 fw-bold">Post a New Project</h1>
            <p className="text-muted">Tell us what you need and find the best freelancers for the job.</p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="project-form">
            <FormInput
              label="Project Title"
              name="title"
              placeholder="e.g. Build a Responsive Portfolio Website"
              register={register}
              error={errors.title}
              required
            />
            <small className="text-muted d-block mb-3" style={{ marginTop: '-10px' }}>
              A good title helps freelancers understand your needs at a glance.
            </small>

            <div className="row">
              <div className="col-md-6">
                <FormInput
                  label="Budget (USD)"
                  name="budget"
                  type="number"
                  placeholder="500"
                  register={register}
                  error={errors.budget}
                  required
                />
              </div>
              <div className="col-md-6">
                <FormSelect
                  label="Category"
                  name="category"
                  placeholder="Select a category"
                  register={register}
                  error={errors.category}
                  options={categories}
                  required
                />
              </div>
            </div>

            <FormTextArea
              label="Project Description"
              name="description"
              placeholder="Describe your project in detail..."
              rows={6}
              register={register}
              error={errors.description}
              required
            />
            <small className="text-muted d-block mb-4" style={{ marginTop: '-10px' }}>
              Include requirements, tech stack, and any specific goals.
            </small>

            <div className="form-actions d-flex justify-content-end gap-3 mt-4">
              <button type="button" onClick={() => navigate(-1)} className="premium-btn premium-btn-secondary px-4">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="premium-btn premium-btn-primary px-4">
                {loading ? 'Posting...' : 'Post Project Now'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
