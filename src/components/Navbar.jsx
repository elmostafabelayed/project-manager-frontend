import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import "./css/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
    setOpen(false);
  };

  const getDashboardLink = () => {
    if (role === "1") return "/client/dashboard";
    if (role === "2") return "/freelancer/dashboard";
    if (role === "3") return "/admin/dashboard";
    return "/";
  };

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
          {/* Hire freelancers Dropdown - Visible to guests and Clients */}
          {(!role || role === "1") && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#">
                Hire freelancers
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Design & creative</a></li>
                <li><a className="dropdown-item" href="#">Developpement & tech</a></li>
                <li><a className="dropdown-item" href="#">AI & emerging tech</a></li>
                <li><a className="dropdown-item" href="#">Markeing</a></li>
                <li><a className="dropdown-item" href="#">Writing & content</a></li>
                <li><a className="dropdown-item" href="#">Adming & support</a></li>
              </ul>
            </li>
          )}

          {/* Find work Dropdown - Visible to guests and Freelancers */}
          {(!role || role === "2") && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#">
                Find work
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Design & creative jobs</a></li>
                <li><a className="dropdown-item" href="#">Developpement & tech jobs</a></li>
                <li><a className="dropdown-item" href="#">AI & emerging tech jobs</a></li>
                <li><a className="dropdown-item" href="#">Markeing jobs</a></li>
                <li><a className="dropdown-item" href="#">Writing & content jobs</a></li>
                <li><a className="dropdown-item" href="#">Adming & support jobs</a></li>
              </ul>
            </li>
          )}

          {/* Admin Panel - Visible to Admin */}
          {role === "3" && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#">
                Admin Panel
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/admin/manage-users">Manage Users</Link></li>
                <li><Link className="dropdown-item" to="/admin/manage-projects">Manage Projects</Link></li>
                <li><Link className="dropdown-item" to="/admin/dashboard">Platform Stats</Link></li>
              </ul>
            </li>
          )}

          {/* Dynamic Links */}
          {role === "2" && (
            <li>
              <Link to="/freelancer/browse-projects">Browse Projects</Link>
            </li>
          )}
          {token && (
            <li>
              <Link to={getDashboardLink()}>Dashboard</Link>
            </li>
          )}

          <li><Link to="/shared/aboutUs">About Us</Link></li>
          <li><Link to="/shared/contact">Contact</Link></li>
        </ul>

        <div className="navbar-auth">
          {!token ? (
            <>
              <Link to="/auth/login" className="btn-secondary">Log in</Link>
              <Link to="/auth/register" className="btn-primary">Sign up</Link>
            </>
          ) : (
            <div className="user-nav">
              <span className="user-name">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />
      <div className={`sidebar ${open ? "active" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>✕</button>

        <div className="sidebar-logo">
          <img src="/img/logon.png" alt="logo" />
        </div>

        <ul>
          {(!role || role === "1") && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="hireDropdown">
                Hire freelancers
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/freelancer/design">Design & Creative</Link></li>
                <li><Link className="dropdown-item" to="/freelancer/development">Development & Tech</Link></li>
                <li><Link className="dropdown-item" to="/freelancer/ai">AI & Emerging Tech</Link></li>
                <li><Link className="dropdown-item" to="/freelancer/marketing">Marketing</Link></li>
                <li><Link className="dropdown-item" to="/freelancer/writing">Writing & Content</Link></li>
                <li><Link className="dropdown-item" to="/freelancer/admin">Admin & Support</Link></li>
              </ul>
            </li>
          )}

          {(!role || role === "2") && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="workDropdown">
                Find work
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/jobs/design">Design & Creative Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/development">Development & Tech Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/ai">AI & Emerging Tech Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/marketing">Marketing Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/writing">Writing & Content Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/admin">Admin & Support Jobs</Link></li>
              </ul>
            </li>
          )}

          {role === "3" && (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#">
                Admin Management
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/admin/manage-users" onClick={() => setOpen(false)}>Manage Users</Link></li>
                <li><Link className="dropdown-item" to="/admin/manage-projects" onClick={() => setOpen(false)}>Manage Projects</Link></li>
                <li><Link className="dropdown-item" to="/admin/dashboard" onClick={() => setOpen(false)}>Stats Dashboard</Link></li>
              </ul>
            </li>
          )}

          {token && (
            <li><Link to={getDashboardLink()} onClick={() => setOpen(false)}>Dashboard</Link></li>
          )}
          {role === "2" && (
            <li><Link to="/freelancer/browse-projects" onClick={() => setOpen(false)}>Browse Projects</Link></li>
          )}
          <li><Link to="/shared/aboutUs" onClick={() => setOpen(false)}>About Us</Link></li>
          <li><Link to="/shared/contact" onClick={() => setOpen(false)}>Contact</Link></li>
        </ul>

        <hr />

        <div className="auth-links">
          {!token ? (
            <>
              <Link to="/auth/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/auth/register" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn-logout-sidebar">Logout</button>
          )}
        </div>
      </div>
    </>
  );
}
