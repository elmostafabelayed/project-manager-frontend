import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../../store/slices/projectSlice';
import Navbar from '../../components/Navbar';
import './Dashboard.css';

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Filter projects owned by the current user
  const myProjects = items.filter(p => p.client_id === user?.id);

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content container">
        <aside className="dashboard-sidebar">
          <div className="user-profile-sm">
            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=185fa5&color=fff`} alt="user" />
            <div className="user-info">
              <h3>{user?.name}</h3>
              <p>Client Account</p>
            </div>
          </div>
          <nav className="dash-nav">
            <Link to="/client/dashboard" className="active">My Dashboard</Link>
            <Link to="/client/my-projects">My Projects</Link>
            <Link to="/shared/profile">Profile Settings</Link>
          </nav>
        </aside>

        <main className="dashboard-main">
          <header className="dash-header">
            <div>
              <h1>Client Dashboard</h1>
              <p>Welcome back! Here's what's happening with your projects.</p>
            </div>
            <Link to="/client/create-project" className="btn-create-project">
              + Post a New Project
            </Link>
          </header>

          <section className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Projects</span>
              <span className="stat-value">{myProjects.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Active Proposals</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Budget Spent</span>
              <span className="stat-value">$0</span>
            </div>
          </section>

          <section className="recent-projects">
            <div className="section-header">
              <h2>Recent Projects</h2>
              <Link to="/client/my-projects">View All</Link>
            </div>

            {loading ? (
              <div className="cl-loading-state">
                <div className="cl-spinner"></div>
                <p>Loading your projects...</p>
              </div>
            ) : myProjects.length === 0 ? (
              <div className="empty-projects">
                <div className="cl-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    <path d="M12 18v-6"/>
                    <path d="M9 15h6"/>
                  </svg>
                </div>
                <p>You haven't posted any projects yet.</p>
                <Link to="/client/create-project" className="cl-btn-action">Start by posting your first project!</Link>
              </div>
            ) : (
              <div className="dashboard-project-list">
                {myProjects.slice(0, 5).map(project => (
                  <div key={project.id} className="dash-project-item">
                    <div className="project-info">
                      <h3>{project.title}</h3>
                      <p>Budget: ${project.budget}</p>
                    </div>
                    <div className="project-actions">
                      <Link to={`/client/projects/${project.id}/proposals`} className="btn-view-proposals">
                        View Proposals
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
