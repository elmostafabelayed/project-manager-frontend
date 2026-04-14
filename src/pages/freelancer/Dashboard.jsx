import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';
import { fetchMyProposals } from '../../store/slices/proposalSlice';
import Navbar from '../../components/Navbar';
import './FreelancerDashboard.css';

export default function FreelancerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { items: proposals, loading: proposalsLoading } = useSelector((state) => state.proposals);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchMyProposals());
  }, [dispatch]);

  const loading = projectsLoading || proposalsLoading;

  // Stats derived from proposals
  const pendingProposals = proposals.filter(p => p.status === 'pending' || !p.status);
  const acceptedProposals = proposals.filter(p => p.status === 'accepted');
  const totalEarnings = acceptedProposals.reduce((sum, p) => sum + Number(p.price || 0), 0);

  // Recent proposals (last 5)
  const recentProposals = proposals.slice(0, 5);

  // Available projects (not already applied to)
  const appliedProjectIds = proposals.map(p => p.project_id);
  const availableProjects = projects.filter(p => !appliedProjectIds.includes(p.id)).slice(0, 4);

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  return (
    <div className="fl-dashboard-container">
      <Navbar />

      <div className="fl-dashboard-content container">
        <aside className="fl-dashboard-sidebar">
          <div className="fl-user-profile">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=185fa5&color=fff&size=96`}
              alt="user"
              className="fl-avatar"
            />
            <div className="fl-user-info">
              <h3>{user?.name}</h3>
              <p>Freelancer Account</p>
            </div>
          </div>

          <nav className="fl-dash-nav">
            <Link to="/freelancer/dashboard" className="fl-nav-link active">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              Dashboard
            </Link>
            <Link to="/freelancer/browse-projects" className="fl-nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              Browse Projects
            </Link>
            <Link to="/freelancer/my-proposals" className="fl-nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
              </svg>
              My Proposals
            </Link>
            <Link to="/shared/profile" className="fl-nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
              Profile Settings
            </Link>
          </nav>
        </aside>

        <main className="fl-dashboard-main">
          {/* Header */}
          <header className="fl-dash-header">
            <div>
              <h1>Freelancer Dashboard</h1>
              <p>Welcome back, <strong>{user?.name}</strong>! Here's your activity overview.</p>
            </div>
            <Link to="/freelancer/browse-projects" className="fl-btn-browse">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              Find New Projects
            </Link>
          </header>

          {/* Stats */}
          <section className="fl-stats-grid">
            <div className="fl-stat-card fl-stat-proposals">
              <div className="fl-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                </svg>
              </div>
              <div className="fl-stat-data">
                <span className="fl-stat-value">{proposals.length}</span>
                <span className="fl-stat-label">Total Proposals</span>
              </div>
            </div>
            <div className="fl-stat-card fl-stat-pending">
              <div className="fl-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className="fl-stat-data">
                <span className="fl-stat-value">{pendingProposals.length}</span>
                <span className="fl-stat-label">Pending</span>
              </div>
            </div>
            <div className="fl-stat-card fl-stat-active">
              <div className="fl-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="fl-stat-data">
                <span className="fl-stat-value">{acceptedProposals.length}</span>
                <span className="fl-stat-label">Accepted</span>
              </div>
            </div>
            <div className="fl-stat-card fl-stat-earnings">
              <div className="fl-stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" x2="12" y1="2" y2="22"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="fl-stat-data">
                <span className="fl-stat-value">${totalEarnings.toLocaleString()}</span>
                <span className="fl-stat-label">Total Earnings</span>
              </div>
            </div>
          </section>

          {/* Recent Proposals */}
          <section className="fl-section-card">
            <div className="fl-section-header">
              <h2>Recent Proposals</h2>
              <Link to="/freelancer/my-proposals">View All →</Link>
            </div>

            {loading ? (
              <div className="fl-loading-state">
                <div className="fl-spinner"></div>
                <p>Loading your proposals...</p>
              </div>
            ) : recentProposals.length === 0 ? (
              <div className="fl-empty-state">
                <div className="fl-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    <path d="M10 12h4"/>
                  </svg>
                </div>
                <p>You haven't submitted any proposals yet.</p>
                <Link to="/freelancer/browse-projects" className="fl-btn-action">
                  Browse Projects & Apply
                </Link>
              </div>
            ) : (
              <div className="fl-proposals-list">
                {recentProposals.map(proposal => (
                  <div key={proposal.id} className="fl-proposal-item">
                    <div className="fl-proposal-info">
                      <h3>{proposal.project?.title || 'Untitled Project'}</h3>
                      <div className="fl-proposal-meta">
                        <span className="fl-proposal-client">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="5"/>
                            <path d="M20 21a8 8 0 1 0-16 0"/>
                          </svg>
                          <Link to={`/shared/profile/${proposal.project?.client?.id}`} className="text-decoration-none">
                            {proposal.project?.client?.name || 'Client'}
                          </Link>
                        </span>
                        <span className="fl-proposal-price">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" x2="12" y1="2" y2="22"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                          ${proposal.price}
                        </span>
                      </div>
                    </div>
                    <span className={`fl-status-badge ${getStatusClass(proposal.status)}`}>
                      {getStatusLabel(proposal.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Available Projects */}
          <section className="fl-section-card">
            <div className="fl-section-header">
              <h2>Recommended Projects</h2>
              <Link to="/freelancer/browse-projects">See All →</Link>
            </div>

            {projectsLoading ? (
              <div className="fl-loading-state">
                <div className="fl-spinner"></div>
                <p>Loading projects...</p>
              </div>
            ) : availableProjects.length === 0 ? (
              <div className="fl-empty-state">
                <p>No new projects available right now.</p>
              </div>
            ) : (
              <div className="fl-projects-grid">
                {availableProjects.map(project => (
                  <div key={project.id} className="fl-project-card">
                    <div className="fl-project-card-top">
                      <span className="fl-project-budget">${project.budget}</span>
                      <span className="fl-project-tag">New</span>
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description?.substring(0, 100)}...</p>
                    <div className="fl-project-card-footer">
                      <div className="fl-project-client-info">
                        <img
                          src={`https://ui-avatars.com/api/?name=${project.client?.name || 'C'}&background=e2e8f0&color=334155&size=28`}
                          alt="client"
                        />
                        <Link to={`/shared/profile/${project.client?.id}`} className="text-decoration-none text-muted">
                          {project.client?.name || 'Client'}
                        </Link>
                      </div>
                      <Link to={`/freelancer/submit-proposal/${project.id}`} className="fl-btn-apply">
                        Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
