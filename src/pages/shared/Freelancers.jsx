import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import profileService from '../../services/profileService';
import { categories } from '../../utils/categoryConstants';
import { useSelector } from 'react-redux';
import InviteModal from '../../components/InviteModal';
import './Freelancers.css';

export default function Freelancers() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(categoryFromUrl);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isClient = user && user.role_id === 1; // Assuming 1 is client role ID

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        const data = await profileService.getFreelancers(category || '');
        setFreelancers(data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [category]);

  const handleCategoryChange = (cat) => {
    if (cat) {
      navigate(`/shared/freelancers?category=${encodeURIComponent(cat)}`);
    } else {
      navigate('/shared/freelancers');
    }
  };

  // Update category when URL changes
  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  return (
    <div className="freelancers-page bg-light min-vh-100 pt-5 mt-5">
      <div className="container">
        <header className="page-header mb-4">
          <h1 className="fw-bold">Hire Top Freelancers</h1>
          <p className="text-muted">Find the perfect expert for your next project.</p>
        </header>

        <div className="row">
          {/* Sidebar / Filters */}
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

          {/* Freelancer List */}
          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : freelancers.length > 0 ? (
              <div className="row g-4">
                {freelancers.map(freelancer => (
                  <div key={freelancer.id} className="col-md-6 col-xl-4">
                    <div className="card h-100 border-0 shadow-sm freelancer-card">
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-3">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${freelancer.name}&background=random&color=fff`} 
                            alt={freelancer.name}
                            className="avatar-md rounded-circle me-3"
                          />
                          <div>
                            <h5 className="mb-0 fw-bold">{freelancer.name}</h5>
                            <small className="text-muted">{freelancer.profile?.location || 'Global'}</small>
                          </div>
                        </div>
                        <h6 className="text-primary fw-bold mb-2">{freelancer.profile?.title || 'Freelancer'}</h6>
                        <p className="card-text text-truncate-2 small mb-3">
                          {freelancer.profile?.bio || 'No bio provided yet.'}
                        </p>
                        <div className="mb-3">
                          {freelancer.skills?.slice(0, 3).map(skill => (
                            <span key={skill.id} className="badge bg-light text-dark border me-1 mb-1">
                              {skill.name}
                            </span>
                          ))}
                          {freelancer.skills?.length > 3 && (
                            <span className="badge bg-light text-dark border small">+{freelancer.skills.length - 3}</span>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="fw-bold">${freelancer.profile?.hourly_rate || 0}/hr</span>
                          <div className="d-flex gap-2">
                            <Link to={`/shared/profile/${freelancer.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                              View Profile
                            </Link>
                            {isClient && (
                              <button 
                                className="btn btn-primary btn-sm rounded-pill px-3"
                                onClick={() => {
                                  setSelectedFreelancer(freelancer);
                                  setShowInviteModal(true);
                                }}
                              >
                                Invite
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <i className="bi bi-person-x display-4 text-muted mb-3"></i>
                <h4>No freelancers found</h4>
                <p className="text-muted">Try adjusting your filters to find more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showInviteModal && selectedFreelancer && (
        <InviteModal 
          freelancer={selectedFreelancer} 
          onClose={() => {
            setShowInviteModal(false);
            setSelectedFreelancer(null);
          }} 
        />
      )}
    </div>
  );
}
