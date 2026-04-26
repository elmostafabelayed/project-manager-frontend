import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser, clearError } from "../../store/slices/authSlice";
import { FormInput } from "../../components/common/FormComponents";
import toast from "react-hot-toast";
import "../css/Login.css";


const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (role && localStorage.getItem('token')) redirectByRole(role);
  }, [role]);


  useEffect(() => {
    if (error?.errors) {
      Object.keys(error.errors).forEach((key) => {
        setError(key, {
          type: "manual",
          message: error.errors[key][0],
        });
      });
    }
  }, [error, setError]);

  const redirectByRole = (r) => {
    if (r == "1") navigate("/client/dashboard");
    else if (r == "2") navigate("/freelancer/browse-projects");
    else if (r == "3") navigate("/admin/dashboard");
  };

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      redirectByRole(result.payload.user.role_id);
    } else {
      if (!result.payload?.errors) {
         toast.error(result.payload?.error || result.payload?.message || "Incorrect email or password");
      }
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

        {error && !error.errors && (
          <div className="login-error">
            {error.error || error.message || "Incorrect email or password"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="example@email.com"
            register={register}
            error={errors.email}
            required
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            required
          />

          <button type="submit" disabled={loading} className="premium-btn premium-btn-primary w-100">
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
