import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import ProjectCard from '../../components/ProjectCard';
import Navbar from '../../components/Navbar';
import './BrowseProjects.css';

export default function BrowseProjects() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <div className="browse-projects-container">
      <Navbar />
      
      <main className="projects-main">
        <header className="projects-header">
          <div className="container">
            <h1>Browse Available Projects</h1>
            <p>Find the perfect opportunity to showcase your skills.</p>
            
            <div className="search-bar-wrapper">
              <input type="text" placeholder="Search projects (e.g. React, Laravel, Design)..." className="search-input" />
              <button className="btn-search">Search</button>
            </div>
          </div>
        </header>

        <section className="projects-list-section">
          <div className="container">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading projects...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={() => dispatch(fetchProjects())} className="btn-retry">Retry</button>
              </div>
            )}

            {!loading && items.length === 0 && (
              <div className="empty-state">
                <p>No projects found. Check back later!</p>
              </div>
            )}

            <div className="projects-grid">
              {items.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
