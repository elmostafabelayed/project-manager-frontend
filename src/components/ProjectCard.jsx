import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  if (!project) return null; // Or return a skeleton/placeholder

  const categoryMapping = {
    "Design & creative": { slug: "design", label: "Design & Creative" },
    "Developpement & tech": { slug: "development", label: "Development & Tech" },
    "AI & emerging tech": { slug: "ai", label: "AI & Emerging Tech" },
    "Marketing": { slug: "marketing", label: "Marketing" },
    "Writing & content": { slug: "writing", label: "Writing & Content" },
    "Admin & support": { slug: "admin", label: "Admin & Support" }
  };

  const categoryInfo = categoryMapping[project.category] || { slug: "default", label: project.category || "General" };

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className={`project-category cat-${categoryInfo.slug}`}>
          {categoryInfo.label}
        </span>
        <span className="project-budget">${project.budget}</span>
      </div>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">
        {project.description?.substring(0, 30)}...
      </p>
      <div className="project-footer">
        <div className="project-client">
          <Link to={`/shared/profile/${project.client_id}`}>
            <img src={`https://ui-avatars.com/api/?name=${project.client?.name || 'Client'}&background=random`} alt="client" />
          </Link>
          <Link to={`/shared/profile/${project.client_id}`} className="text-decoration-none text-dark">
            <span>{project.client?.name || 'Anonymous Client'}</span>
          </Link>
        </div>
        <Link to={`/freelancer/submit-proposal/${project.id}`} className="btn-apply">
          Apply Now
        </Link>
      </div>
    </div>
  );
}