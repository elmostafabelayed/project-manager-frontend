import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import './css/Landing.css'

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Connectez Clients et Freelancers</h1>
          <p>
            Trouvez des projets ou proposez vos services sur une plateforme moderne et sécurisée.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Commencer</button>
            <button className="btn-secondary">Découvrir</button>
          </div>
        </div>
      </section>

      <section className="featured-projects">
        <h2>Projets en vedette</h2>
        <div className="project-list">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </section>

      <section className="cta">
        <h2>Prêt à lancer votre carrière freelance ?</h2>
        <button className="btn-primary">Inscrivez-vous maintenant</button>
      </section>

      <Footer />
    </div>
  );
};
