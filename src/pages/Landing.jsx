import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InviteModal from "../components/InviteModal";
import ProjectCard from "../components/ProjectCard";
import FreelancerCard from "../components/FreelancerCard";
import projectService from "../services/projectService";
import profileService from "../services/profileService";
import { categoryMapping } from "../utils/categoryConstants";
import "./css/Landing.css";

export default function Landing() {
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (role === "1") {
          // Fetch Featured Freelancers for Client
          const data = await profileService.getFreelancers("");
          setFreelancers(data.slice(0, 3));
        } else {
          // Fetch Featured Projects for Freelancer or Guest
          const data = await projectService.getAllProjects();
          setProjects(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role]);

  const getCategoryLink = (catLabel) => {

    if (role === "2") {
      return `/shared/jobs?category=${encodeURIComponent(catLabel)}`;
    }
    return `/shared/freelancers?category=${encodeURIComponent(catLabel)}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="landing-page">
      <Navbar />
      
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Projects that matter, talents that shine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            A modern platform to achieve your goals or grow your freelance career.
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {!role && <Link to="/auth/register" className="btn-hero-primary">Get Started</Link>}
            <Link to="/shared/jobs" className="btn-hero-secondary">Explore the Platform</Link>
          </motion.div>
        </motion.div>
        <div className="aboutus-hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      <section className="featured-projects">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {role === "1" ? "Featured Freelancers" : "Featured Projects"}
          </motion.h2>
          
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <motion.div 
              className="project-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {role === "1" ? (
                freelancers.length > 0 ? (
                  freelancers.map((freelancer) => (
                    <motion.div key={freelancer.id} variants={itemVariants}>
                      <FreelancerCard 
                        freelancer={freelancer} 
                        isClient={true} 
                        onInvite={(f) => {
                          setSelectedFreelancer(f);
                          setShowInviteModal(true);
                        }}
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="no-projects">No featured freelancers available right now.</p>
                )
              ) : (
                projects.length > 0 ? (
                  projects.map((project) => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <ProjectCard project={project} />
                    </motion.div>
                  ))
                ) : (
                  <p className="no-projects">No featured projects available right now.</p>
                )
              )}
            </motion.div>
          )}

          {!loading && (
            <motion.div 
              className="text-center mt-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link 
                to={role === "1" ? "/shared/freelancers" : "/shared/jobs"} 
                className="btn btn-outline-primary rounded-pill px-4"
              >
                {role === "1" ? "View All Freelancers" : "View All Projects"}
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <section className="categories-section">
        <div className="container text-center">
          <motion.h2 
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Find exactly what you need
          </motion.h2>
          <motion.div 
            className="row"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {Object.entries(categoryMapping).map(([key, cat], index) => {
              const imageMap = {
                'design': 'design-creative.jpeg',
                'development': 'development-it.jpeg',
                'ai': 'ai-services.jpeg',
                'marketing': 'sales-marketing.jpeg',
                'writing': 'writing-translation.jpeg',
                'admin': 'admin-support.jpeg'
              };
              const imgName = imageMap[cat.slug] || 'default-category.jpeg';
              
              return (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <Link to={getCategoryLink(key)} className="category-link">
                    <motion.div 
                      className="category-box"
                      variants={itemVariants}
                      whileHover={{ translateY: -5 }}
                    >
                      <div className="category-img-wrapper">
                        <img
                          src={`/img/${imgName}`}
                          alt={cat.label}
                          className="category-img"
                          onError={(e) => { e.target.src = '/img/default-category.jpeg'; }}
                        />
                      </div>
                      <p>{cat.label}</p>
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <Footer />

      {showInviteModal && selectedFreelancer && (
        <InviteModal 
          freelancer={selectedFreelancer} 
          onClose={() => {
            setShowInviteModal(false);
            setSelectedFreelancer(null);
          }} 
        />
      )}
    </div>
  );
}
