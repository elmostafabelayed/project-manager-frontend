import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePagedCollection from '../../hooks/usePagedCollection';
import Pagination from '../../components/Pagination';
import { fetchMyProposals } from '../../store/slices/proposalSlice';
import ProjectCard from '../../components/ProjectCard';
import './BrowseProjects.css';

export default function BrowseProjects() {
  const dispatch = useDispatch();
  const { items: proposals, loading: proposalsLoading } = useSelector((state) => state.proposals);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchMyProposals());
  }, [dispatch]);

  const { items: projects, loading: projectsLoading, error, pagination, setPage, refresh } = usePagedCollection('/projects', { search: searchTerm, available: true });

  const loading = projectsLoading || proposalsLoading;


  const appliedProjectIds = (proposals || []).map(p => p.project_id);
  const availableProjects = projects.filter(p => !appliedProjectIds.includes(p.id));


  const filteredProjects = availableProjects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="browse-projects-container">


      <main className="projects-main">
        <header className="projects-header">
          <div className="container">
            <h1>Browse Available Projects</h1>
            <p>Find the perfect opportunity to showcase your skills.</p>

            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Search projects by title or description..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

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
                <button onClick={() => refresh()} className="btn-retry">Retry</button>
              </div>
            )}

            {!loading && availableProjects.length === 0 && (
              <div className="empty-state">
                <p>No new projects found or you have already applied to all of them. Check back later!</p>
              </div>
            )}

            {!loading && availableProjects.length > 0 && filteredProjects.length === 0 && (
              <div className="empty-state">
                <p>No projects found matching "<strong>{searchTerm}</strong>". Try a different keyword.</p>
              </div>
            )}

            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} loading={loading} />
          </div>
        </section>
      </main>
    </div>
  );
}
