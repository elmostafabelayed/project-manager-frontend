import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="cl-loading-state p-5 text-center"><div className="cl-spinner"></div></div>;

  return (
    <div className="bg-background min-vh-100 mt-5">
      <Navbar />
      <div className="container py-5">
        <h1 className="fw-bold mb-4">Admin Dashboard</h1>
        
        <div className="row g-4 mb-5">
           <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center">
                 <h4 className="text-muted small text-uppercase fw-bold">Total Users</h4>
                 <div className="h2 fw-bold text-primary">{stats?.total_users}</div>
              </div>
           </div>
           <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center">
                 <h4 className="text-muted small text-uppercase fw-bold">Projects</h4>
                 <div className="h2 fw-bold text-success">{stats?.total_projects}</div>
              </div>
           </div>
           <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center">
                 <h4 className="text-muted small text-uppercase fw-bold">Clients</h4>
                 <div className="h2 fw-bold">{stats?.active_clients}</div>
              </div>
           </div>
           <div className="col-md-3">
              <div className="card border-0 shadow-sm p-4 text-center">
                 <h4 className="text-muted small text-uppercase fw-bold">Freelancers</h4>
                 <div className="h2 fw-bold">{stats?.active_freelancers}</div>
              </div>
           </div>
        </div>

        <div className="row">
           <div className="col-md-6">
              <Link to="/admin/manage-users" className="card border-0 shadow-sm p-5 text-center text-decoration-none hover-lift mb-4">
                 <h3 className="fw-bold text-dark">Manage Users</h3>
                 <p className="text-muted">View and manage all registered accounts.</p>
              </Link>
           </div>
           <div className="col-md-6">
              <Link to="/admin/manage-projects" className="card border-0 shadow-sm p-5 text-center text-decoration-none hover-lift mb-4">
                 <h3 className="fw-bold text-dark">Manage Projects</h3>
                 <p className="text-muted">Monitor all projects and job postings.</p>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
