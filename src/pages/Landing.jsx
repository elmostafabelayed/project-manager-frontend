import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import "./css/Landing.css";

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Projects that matter, talents that shine</h1>
          <p>
            A modern platform to achieve your goals or grow your freelance
            career.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Explore the Platform</button>
          </div>
        </div>
      </section>

      <section className="featured-projects">
        <h2>Projets en vedette</h2>
        <div className="project-list">
          <ProjectCard project={{ id: 1, title: 'Modern E-commerce App', budget: 1500, description: 'Build a full-stack e-commerce solution using React and Laravel.', client: { name: 'TechCorp' } }} />
          <ProjectCard project={{ id: 2, title: 'Brand Identity Design', budget: 500, description: 'Create a unique brand identity for a startup in the green tech sector.', client: { name: 'GreenLife' } }} />
          <ProjectCard project={{ id: 3, title: 'AI Chatbot Integration', budget: 1200, description: 'Integrate an AI-powered chatbot into an existing customer support system.', client: { name: 'CloudSoft' } }} />
        </div>
      </section>

      <section className="categories-section">
        <div className="container text-center">
          <h2 className="mb-4">Find freelancers for every type of work</h2>
          <div className="row">
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/ai-services.jpeg"
                  alt="AI Services"
                  className="category-img"
                />
                <p>AI Services</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/development-it.jpeg"
                  alt="Development & IT"
                  className="category-img"
                />
                <p>Development & IT</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/design-creative.jpeg"
                  alt="Design & Creative"
                  className="category-img"
                />
                <p>Design & Creative</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/sales-marketing.jpeg"
                  alt="Sales & Marketing"
                  className="category-img"
                />
                <p>Sales & Marketing</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/writing-translation.jpeg"
                  alt="Writing & Translation"
                  className="category-img"
                />
                <p>Writing & Translation</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 mb-3">
              <div className="category-box">
                <img
                  src="/img/admin-support.jpeg"
                  alt="Admin & Support"
                  className="category-img"
                />
                <p>Admin & Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
