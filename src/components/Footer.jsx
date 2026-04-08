import "./css/Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/">
            <img src="/img/logo.png" alt="logo" className="footer-logo"/>
          </Link>
          <p>
            Connect talents with opportunities. Build your career or find the
            perfect freelancer.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <a href="#">Find Work</a>
            <a href="#">Find Talent</a>
            <a href="#">Categories</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Jobsy. All rights reserved.</p>
      </div>
    </footer>
  );
}
