import React from 'react';
import { Link } from 'react-router-dom';
import { getAvatarUrl } from '../utils/avatarHelper';
import './FreelancerCard.css';

const FreelancerCard = ({ freelancer, isClient, onInvite }) => {
  return (
    <div className="card border-0 shadow-sm freelancer-card">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img 
            src={getAvatarUrl(freelancer)} 
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
            {isClient && onInvite && (
              <button 
                className="btn btn-primary btn-sm rounded-pill px-3"
                onClick={() => onInvite(freelancer)}
              >
                Invite
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
