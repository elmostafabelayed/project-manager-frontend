import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../css/Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      q: "How do I create an account?",
      a: "Click the 'Sign Up' button in the navigation bar, choose whether you're a client or freelancer, fill in your details, and you're ready to go!",
    },
    {
      q: "How does payment work?",
      a: "Clients fund projects upfront through our secure escrow system. Freelancers receive payment once milestones are approved.",
    },
    {
      q: "Can I be both a client and a freelancer?",
      a: "Currently, each account is associated with a single role. You can create separate accounts if you'd like to use both roles.",
    },
    {
      q: "How do I report an issue?",
      a: "You can use this contact form or email us directly at support@jobsy.com. We typically respond within 24 hours.",
    },
  ];

  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-badge">Get in Touch</span>
          <h1>We'd Love to Hear From You</h1>
          <p>
            Have a question, feedback, or just want to say hello? Reach out and
            we'll get back to you as soon as possible.
          </p>
        </div>
        <div className="contact-hero-shapes">
          <div className="c-shape c-shape-1"></div>
          <div className="c-shape c-shape-2"></div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="contact-info">
        <div className="info-card">
          <div className="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>
          <h3>Email Us</h3>
          <p>support@jobsy.com</p>
          <span>We reply within 24 hours</span>
        </div>
        <div className="info-card">
          <div className="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h3>Call Us</h3>
          <p>+212 5XX-XXXXXX</p>
          <span>Mon - Fri, 9AM to 6PM</span>
        </div>
        <div className="info-card">
          <div className="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <h3>Visit Us</h3>
          <p>Casablanca, Morocco</p>
          <span>By appointment only</span>
        </div>
      </section>

      {/* Contact Form + FAQ */}
      <section className="contact-main">
        <div className="contact-form-wrapper">
          <h2>Send Us a Message</h2>
          <p className="form-subtitle">
            Fill out the form below and our team will get back to you shortly.
          </p>

          {submitted && (
            <div className="success-toast">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Message sent successfully! We'll be in touch soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="How can we help?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                placeholder="Tell us more about your inquiry..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="contact-submit-btn">
              Send Message
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>

        <div className="contact-faq-wrapper">
          <h2>Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Quick answers to common questions.
          </p>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className="faq-chevron"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
