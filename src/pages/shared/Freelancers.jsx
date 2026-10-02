import usePagedCollection from '../../hooks/usePagedCollection';
import Pagination from '../../components/Pagination';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { categories } from '../../utils/categoryConstants';
import { useSelector } from 'react-redux';
import InviteModal from '../../components/InviteModal';
import FreelancerCard from '../../components/FreelancerCard';
import './Freelancers.css';

export default function Freelancers() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get('category');

  const [category, setCategory] = useState(categoryFromUrl);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const isClient = user && user.role_id === 1;

  const { items: freelancers, loading, error, pagination, setPage, refresh } = usePagedCollection('/freelancers', { category: category || '' });

  const handleCategoryChange = (cat) => {
    if (cat) {
      navigate(`/shared/freelancers?category=${encodeURIComponent(cat)}`);
    } else {
      navigate('/shared/freelancers');
    }
  };


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
            {error && <div role="alert" className="alert alert-danger">{error} <button onClick={refresh}>Retry</button></div>}
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
                    <FreelancerCard
                      freelancer={freelancer}
                      isClient={isClient}
                      onInvite={(f) => {
                        setSelectedFreelancer(f);
                        setShowInviteModal(true);
                      }}
                    />
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
            <Pagination pagination={pagination} onPageChange={setPage} loading={loading} />
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
