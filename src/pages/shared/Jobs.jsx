import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import projectService from '../../services/projectService';
import { categories, getCategoryInfo } from '../../utils/categoryConstants';
import { getAvatarUrl } from '../../utils/avatarHelper';
import '../../components/ProjectCard.css';
import './Jobs.css';

export default function Jobs() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryFromUrl);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects(category || '');
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  const handleCategoryChange = (cat) => {
    if (cat) {
      navigate(`/shared/jobs?category=${encodeURIComponent(cat)}`);
    } else {
      navigate('/shared/jobs');
    }
  };


  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  return (
    <div className="jobs-page bg-light min-vh-100 pt-5 mt-5">
      <div className="container">
        <header className="page-header mb-4">
          <h1 className="fw-bold">Find Your Next Job</h1>
          <p className="text-muted">Browse the latest opportunities and take your career to the next level.</p>
        </header>

        <div className="row">
          
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">Categories</h5>
                <div className="category-list">
                  <button 
                    className={`category-btn ${!category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('')}
                  >
                    All Categories
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`category-btn ${category === cat ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="row g-4">
                {jobs.map(job => (
                  <div key={job.id} className="col-md-6 col-xl-4">
                    <div className="card h-100 border-0 shadow-sm job-card">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className={`project-category cat-${getCategoryInfo(job.category).slug}`}>
                            {getCategoryInfo(job.category).label}
                          </span>
                          <span className="fw-bold text-success">${job.budget}</span>
                        </div>
                        
                        <h5 className="card-title fw-bold mb-2">{job.title}</h5>
                        
                        <p className="card-text text-truncate-2 small mb-3 text-muted">
                          {job.description || 'No description provided.'}
                        </p>
                        
                        <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <img 
                              src={getAvatarUrl(job.client)} 
                              alt="client"
                              className="rounded-circle me-2"
                              style={{ width: '24px', height: '24px' }}
                            />
                            <small className="text-muted text-truncate" style={{ maxWidth: '100px' }}>
                              {job.client?.name || 'Client'}
                            </small>
                          </div>
                          <Link to={`/freelancer/submit-proposal/${job.id}`} className="btn btn-primary btn-sm rounded-pill px-3">
                            Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <i className="bi bi-briefcase display-4 text-muted mb-3"></i>
                <h4>No jobs found</h4>
                <p className="text-muted">Try adjusting your filters to find more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
