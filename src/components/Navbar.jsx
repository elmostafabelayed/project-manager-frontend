import React from "react";

import "./css/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/img/logon.png" style={{ height: "190px", width: "auto" }} alt="Jobsy" />
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/client/dashboard">Clients</Link>
        </li>
        <li>
          <Link to="/freelancer/browse-projects">Freelancers</Link>
        </li>
        <li>
          <Link to="/shared/project-details">Projets</Link>
        </li>
        <li>
          <Link to="/shared/chat">Messages</Link>
        </li>
      </ul>

      <div className="navbar-auth">
        <Link to="/auth/login" className="btn-secondary">
          Connexion
        </Link>
        <Link to="/auth/register" className="btn-primary">
          Inscription
        </Link>
      </div>
    </nav>
  );
}
