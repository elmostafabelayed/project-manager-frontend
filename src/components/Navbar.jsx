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
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#">
              Hire freelancers
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#">
                  Design & creative
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Developpement & tech
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  AI & emerging tech
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Markeing
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Writing & content
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Adming & support
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#">
              Find work
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#">
                  Design & creative jobs
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Developpement & tech jobs
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  AI & emerging tech jobs
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Markeing jobs
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Writing & content jobs
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Adming & support jobs
                </a>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/shared/aboutUs">About Us</Link>
          </li>
          <li>
            <Link to="/shared/contact">Contact</Link>
          </li>
        </ul>

        <div className="navbar-auth">
          <Link to="/auth/login" className="btn-secondary">
            Log in
          </Link>
          <Link to="/auth/register" className="btn-primary">
            Sign up
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
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="hireDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Hire freelancers
            </a>
            <ul className="dropdown-menu" aria-labelledby="hireDropdown">
              <li>
                <Link className="dropdown-item" to="/freelancer/design">
                  Design & Creative
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/freelancer/development">
                  Development & Tech
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/freelancer/ai">
                  AI & Emerging Tech
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/freelancer/marketing">
                  Marketing
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/freelancer/writing">
                  Writing & Content
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/freelancer/admin">
                  Admin & Support
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="workDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Find work
            </a>
            <ul className="dropdown-menu" aria-labelledby="workDropdown">
              <li>
                <Link className="dropdown-item" to="/jobs/design">
                  Design & Creative Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/jobs/development">
                  Development & Tech Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/jobs/ai">
                  AI & Emerging Tech Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/jobs/marketing">
                  Marketing Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/jobs/writing">
                  Writing & Content Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/jobs/admin">
                  Admin & Support Jobs
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to="/shared/aboutUs" onClick={() => setOpen(false)}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/shared/contact" onClick={() => setOpen(false)}>
              Contact
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
