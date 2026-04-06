import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="navbar fixed-top">
        <button className="menu-btn" onClick={() => setOpen(true)}>
          ☰
        </button>

        <div className="navbar-logo">
          <Link to="/">
            <img src="/img/logo.png" alt="logo" />
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

      <div
        className={`overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />
      <div className={`sidebar ${open ? "active" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>

        <div className="sidebar-logo">
          <img src="/img/logon.png" alt="logo" />
        </div>

        <ul>
          <li>
            <Link to="/client/dashboard" onClick={() => setOpen(false)}>
              Clients
            </Link>
          </li>
          <li>
            <Link
              to="/freelancer/browse-projects"
              onClick={() => setOpen(false)}
            >
              Freelancers
            </Link>
          </li>
          <li>
            <Link to="/shared/project-details" onClick={() => setOpen(false)}>
              Projets
            </Link>
          </li>
          <li>
            <Link to="/shared/chat" onClick={() => setOpen(false)}>
              Messages
            </Link>
          </li>
        </ul>

        <hr />

        <div className="auth-links">
          <Link to="/auth/login" onClick={() => setOpen(false)}>
            Connexion
          </Link>
          <Link to="/auth/register" onClick={() => setOpen(false)}>
            Inscription
          </Link>
        </div>
      </div>
    </>
  );
}
