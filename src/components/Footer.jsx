import { useState } from 'react';
import api from '../services/api';
import "./css/Footer.css";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const subscribe = async event => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const response = await api.post('/newsletter', { email });
      setNotice(response.data.message);
      setEmail('');
    } catch { setNotice('Could not subscribe. Please check your email and retry.'); }
    finally { setSaving(false); }
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/">
              <img src="/img/logo.png" alt="logo" className="footer-logo"/>
            </Link>
            <p>
              The world's work marketplace. Connect talents with opportunities. 
              Build your career or find the perfect freelancer for your next big project.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/profile.php?id=61562951310171" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="https://x.com/Jobsy230268" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://www.linkedin.com/in/jobsy-jobsy-08374a405/" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="https://www.instagram.com/" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h4>For Clients</h4>
              <Link to="/shared/freelancers">How to hire</Link>
              <Link to="/shared/freelancers">Browse Freelancers</Link>
              <Link to="/auth/register">Project Planning</Link>
            </div>

            <div className="footer-column">
              <h4>For Freelancers</h4>
              <Link to="/shared/jobs">How to find work</Link>
              <Link to="/shared/jobs">Browse Jobs</Link>
              <Link to="/auth/register">Freelance Tips</Link>
            </div>

            <div className="footer-column">
              <h4>Company</h4>
              <Link to="/shared/aboutUs">About Us</Link>
              <Link to="/shared/contact">Contact Us</Link>
              <Link to="/shared/aboutUs">Trust & Safety</Link>
            </div>

            <div className="footer-column newsletter">
              <h4>Stay Updated</h4>
              <p>Subscribe to our newsletter for the latest updates.</p>
              <form className="newsletter-form" onSubmit={subscribe}>
                <input type="email" aria-label="Newsletter email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} />
                <button type="submit" disabled={saving}>{saving ? "Saving…" : "Join"}</button>
              </form>
              {notice && <p role="status">{notice}</p>}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2026 Jobsy. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <Link to="/shared/contact">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
