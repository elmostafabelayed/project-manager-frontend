import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import NotificationDropdown from "./NotificationDropdown";
import "./css/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, role } = useSelector((state) => state.auth);
  const [activeDropdown, setActiveDropdown] = React.useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".nav-item.dropdown") && !event.target.closest(".sidebar-dropdown")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <li className={`nav-item dropdown ${activeDropdown === 'hire' ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('hire'); }}
              >
                Hire freelancers
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'hire' ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Design & creative")}`} onClick={() => setActiveDropdown(null)}>Design & creative</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Developpement & tech")}`} onClick={() => setActiveDropdown(null)}>Developpement & tech</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("AI & emerging tech")}`} onClick={() => setActiveDropdown(null)}>AI & emerging tech</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Markeing")}`} onClick={() => setActiveDropdown(null)}>Markeing</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Writing & content")}`} onClick={() => setActiveDropdown(null)}>Writing & content</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Adming & support")}`} onClick={() => setActiveDropdown(null)}>Adming & support</Link></li>
              </ul>
            </li>
          )}

          {/* Find work Dropdown - Visible to guests and Freelancers */}
          {(!role || role === "2") && (
            <li className={`nav-item dropdown ${activeDropdown === 'work' ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('work'); }}
              >
                Find work
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'work' ? 'show' : ''}`}>
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
            <li className={`nav-item dropdown ${activeDropdown === 'admin' ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('admin'); }}
              >
                Admin Panel
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'admin' ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to="/admin/manage-users" onClick={() => setActiveDropdown(null)}>Manage Users</Link></li>
                <li><Link className="dropdown-item" to="/admin/manage-projects" onClick={() => setActiveDropdown(null)}>Manage Projects</Link></li>
                <li><Link className="dropdown-item" to="/admin/dashboard" onClick={() => setActiveDropdown(null)}>Platform Stats</Link></li>
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
            <>
              <li>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </li>
              <li>
                <Link to="/shared/chat" className="message-link">
                  Messages
                  {messageUnreadCount > 0 && (
                    <span className="message-count-badge">{messageUnreadCount}</span>
                  )}
                </Link>
              </li>
            </>
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
              <div className="notification-wrapper">
                <NotificationDropdown onMessageUnreadCountChange={setMessageUnreadCount} />
              </div>
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
            <li className={`nav-item dropdown sidebar-dropdown ${activeDropdown === 'sidebar-hire' ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('sidebar-hire'); }}
              >
                Hire freelancers
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'sidebar-hire' ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Design & creative")}`} onClick={() => setOpen(false)}>Design & Creative</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Developpement & tech")}`} onClick={() => setOpen(false)}>Development & Tech</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("AI & emerging tech")}`} onClick={() => setOpen(false)}>AI & Emerging Tech</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Markeing")}`} onClick={() => setOpen(false)}>Marketing</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Writing & content")}`} onClick={() => setOpen(false)}>Writing & Content</Link></li>
                <li><Link className="dropdown-item" to={`/shared/freelancers?category=${encodeURIComponent("Adming & support")}`} onClick={() => setOpen(false)}>Admin & Support</Link></li>
              </ul>
            </li>
          )}

          {(!role || role === "2") && (
            <li className={`nav-item dropdown sidebar-dropdown ${activeDropdown === 'sidebar-work' ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleDropdown('sidebar-work'); }}
              >
                Find work
              </a>
              <ul className={`dropdown-menu ${activeDropdown === 'sidebar-work' ? 'show' : ''}`}>
                <li><Link className="dropdown-item" to="/jobs/design" onClick={() => setOpen(false)}>Design & Creative Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/development" onClick={() => setOpen(false)}>Development & Tech Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/ai" onClick={() => setOpen(false)}>AI & Emerging Tech Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/marketing" onClick={() => setOpen(false)}>Marketing Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/writing" onClick={() => setOpen(false)}>Writing & Content Jobs</Link></li>
                <li><Link className="dropdown-item" to="/jobs/admin" onClick={() => setOpen(false)}>Admin & Support Jobs</Link></li>
              </ul>
            </li>
          )}

          {role === "3" && (
            <li className="nav-item dropdown sidebar-dropdown">
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

          {token ? (
            <>
              {role === "2" && (
                <li><Link to="/freelancer/browse-projects" onClick={() => setOpen(false)}>Browse Projects</Link></li>
              )}
              <li><Link to={getDashboardLink()} onClick={() => setOpen(false)}>Dashboard</Link></li>
              <li>
                <Link to="/shared/chat" onClick={() => setOpen(false)} className="message-link">
                  Messages
                  {messageUnreadCount > 0 && (
                    <span className="message-count-badge">{messageUnreadCount}</span>
                  )}
                </Link>
              </li>
              <li className="sidebar-notifications">
                <span>Notifications</span>
                <NotificationDropdown onMessageUnreadCountChange={setMessageUnreadCount} />
              </li>
            </>
          ) : null}
          <li><Link to="/shared/aboutUs" onClick={() => setOpen(false)}>About Us</Link></li>
          <li><Link to="/shared/contact" onClick={() => setOpen(false)}>Contact</Link></li>
        </ul>

        <div className="sidebar-footer">
          {token ? (
            <div className="sidebar-user-info">
               <span className="sidebar-user-name">Logged in as: <strong>{user?.name}</strong></span>
               <button onClick={handleLogout} className="btn-logout-sidebar">Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/auth/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/auth/register" onClick={() => setOpen(false)} className="btn-signup-sidebar">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
