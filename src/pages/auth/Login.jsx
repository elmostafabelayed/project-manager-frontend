import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, clearError } from "../../store/slices/authSlice";
import "../css/Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (role && localStorage.getItem('token')) redirectByRole(role);
  }, [role]);

  const redirectByRole = (r) => {
    if (r == "1") navigate("/client/dashboard");
    else if (r == "2") navigate("/freelancer/browse-projects");
    else if (r == "3") navigate("/admin/dashboard");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      redirectByRole(result.payload.user.role_id);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/img/logon.png" alt="Jobsy" />
          <p style={{ color: "#888780", fontSize: "14px", marginTop: "8px" }}>
            Log in to your account
          </p>
        </div>

        {error && (
          <div className="login-error">
            {error.message || "Incorrect email or password"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="login-input"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="login-input"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account yet?{" "}
          <Link
            to="/auth/register"
            style={{ color: "#185FA5", fontWeight: "600" }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
