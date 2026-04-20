import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createProject } from '../../store/slices/projectSlice';
import Navbar from '../../components/Navbar';
import './CreateProject.css';

export default function CreateProject() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.projects);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(formData));
    if (createProject.fulfilled.match(result)) {
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
        <div className="form-card">
          <header className="form-header">
            <h1>Post a New Project</h1>
            <p>Tell us what you need and find the best freelancers for the job.</p>
          </header>

          {error && !error.errors && <div className="error-alert">{error.message || error}</div>}

          <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Build a Responsive Portfolio Website"
                required
                className={error?.errors?.title ? 'input-error' : ''}
              />
              {error?.errors?.title && <span className="field-error">{error.errors.title[0]}</span>}
              <span className="help-text">A good title helps freelancers understand your needs at a glance.</span>
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget (USD)</label>
              <div className="budget-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="500"
                  required
                  className={error?.errors?.budget ? 'input-error' : ''}
                />
              </div>
              {error?.errors?.budget && <span className="field-error">{error.errors.budget[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={error?.errors?.category ? 'input-error' : ''}
              >
                <option value="" disabled>Select a category</option>
                <option value="design">Design & creative</option>
                <option value="development">Developpement & tech</option>
                <option value="ai">AI & emerging tech</option>
                <option value="marketing">Markeing</option>
                <option value="writing">Writing & content</option>
                <option value="admin">Adming & support</option>
              </select>
              {error?.errors?.category && <span className="field-error">{error.errors.category[0]}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail..."
                rows="6"
                required
                className={error?.errors?.description ? 'input-error' : ''}
              ></textarea>
              {error?.errors?.description && <span className="field-error">{error.errors.description[0]}</span>}
              <span className="help-text">Include requirements, tech stack, and any specific goals.</span>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Posting...' : 'Post Project Now'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
