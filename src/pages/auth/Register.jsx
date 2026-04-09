import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError } from "../../store/slices/authSlice";
import "../css/Register.css";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "1",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      const role = result.payload.user.role_id;
      if (role == 1) navigate("/client/dashboard");
      else if (role == 2) navigate("/freelancer/browse-projects");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img src="/img/logon.png" alt="Jobsy" />
          <p>Create your account for free</p>
        </div>

        {error && (
          <div className="error-box">
            {error.message || "An error occurred"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="role-group">
            <label>I am...</label>

            <div className="role-options">
              {[
                { value: "1", label: "🏢 Client", desc: "I post projects" },
                { value: "2", label: "💼 Freelancer", desc: "I look for work" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`role-card ${form.role_id === opt.value ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="role_id"
                    value={opt.value}
                    checked={form.role_id === opt.value}
                    onChange={handleChange}
                    hidden
                  />

                  <div className="role-title">{opt.label}</div>
                  <div className="role-desc">{opt.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`submit-btn ${loading ? "loading" : ""}`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/auth/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
