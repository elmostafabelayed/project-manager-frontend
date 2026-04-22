import "./css/Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
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
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
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
              <div className="newsletter-form">
                <input type="email" placeholder="Email address" />
                <button type="button">Join</button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2026 Jobsy. All rights reserved.</p>
          </div>
          <div className="footer-legal">
            <Link to="/shared/aboutUs">Terms of Service</Link>
            <Link to="/shared/aboutUs">Privacy Policy</Link>
            <Link to="/shared/aboutUs">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
