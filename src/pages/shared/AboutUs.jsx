import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import "../css/AboutUs.css";

export default function AboutUs() {
  return (
    <div className="aboutus-page">
      <Navbar />

      {/* Hero Section */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-content">
          <span className="aboutus-badge">About Jobsy</span>
          <h1>Empowering Freelancers &amp; Clients Worldwide</h1>
          <p>
            We're building the future of work — a platform where talent meets
            opportunity, and every project finds its perfect match.
          </p>
        </div>
        <div className="aboutus-hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="aboutus-stats">
        <div className="stat-card">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Freelancers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">5K+</span>
          <span className="stat-label">Projects Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">98%</span>
          <span className="stat-label">Satisfaction Rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">50+</span>
          <span className="stat-label">Countries</span>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="aboutus-mission">
        <h2>What Drives Us</h2>
        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                <path d="M2 12h20"/>
              </svg>
            </div>
            <h3>Our Mission</h3>
            <p>
              To democratize access to work by connecting talented freelancers
              with businesses of all sizes, creating a seamless and trusted
              marketplace for project-based collaboration.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3>Our Vision</h3>
            <p>
              A world where geography is no barrier to opportunity — where every
              skilled professional can build a rewarding career, and every
              business can access world-class talent on demand.
            </p>
          </div>
          <div className="mission-card">
            <div className="mission-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <h3>Our Values</h3>
            <p>
              Trust, transparency, and excellence guide everything we do. We
              believe in fair compensation, open communication, and delivering
              quality results that exceed expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="aboutus-story">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            Jobsy was born from a simple frustration: finding the right freelancer
            shouldn't be harder than the project itself. Founded in 2024, we set
            out to create a platform that prioritizes quality, trust, and seamless
            collaboration.
          </p>
          <p>
            What started as a small idea has grown into a thriving community of
            creative professionals, developers, marketers, and writers — all
            united by the desire to do meaningful work on their own terms.
          </p>
          <p>
            Today, Jobsy connects thousands of freelancers with clients across
            the globe, powering everything from brand identity redesigns to
            full-stack application development.
          </p>
        </div>
        <div className="story-visual">
          <div className="story-card story-card-1">
            <span className="story-year">2024</span>
            <span className="story-event">Platform Founded</span>
          </div>
          <div className="story-card story-card-2">
            <span className="story-year">2025</span>
            <span className="story-event">1K+ Freelancers Joined</span>
          </div>
          <div className="story-card story-card-3">
            <span className="story-year">2026</span>
            <span className="story-event">Global Expansion</span>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="aboutus-team">
        <h2>Meet the Team</h2>
        <p className="team-subtitle">
          The passionate people behind Jobsy who work every day to make your
          experience exceptional.
        </p>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">
              <span>AE</span>
            </div>
            <h4>Amine El Mourabit</h4>
            <span className="team-role">CEO & Co-Founder</span>
            <p>Visionary leader with 10+ years in tech entrepreneurship.</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <span>SB</span>
            </div>
            <h4>Sara Bennani</h4>
            <span className="team-role">CTO</span>
            <p>Full-stack architect passionate about scalable platforms.</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <span>KH</span>
            </div>
            <h4>Karim Hadid</h4>
            <span className="team-role">Head of Design</span>
            <p>Creative mind crafting intuitive and delightful experiences.</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">
              <span>LR</span>
            </div>
            <h4>Leila Rami</h4>
            <span className="team-role">Community Manager</span>
            <p>Building bridges between freelancers and clients every day.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="aboutus-cta">
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of freelancers and clients already thriving on Jobsy.
        </p>
        <div className="cta-buttons">
          <Link to="/auth/register" className="cta-btn-primary">
            Sign Up Now
          </Link>
          <Link to="/shared/contact" className="cta-btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
