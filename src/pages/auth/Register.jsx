import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser, clearError } from "../../store/slices/authSlice";
import { FormInput } from "../../components/common/FormComponents";
import toast from "react-hot-toast";
import "../css/Register.css";

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  role_id: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "1",
    },
  });

  const selectedRoleId = watch("role_id");

  // Handle backend errors
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

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully!");
      navigate("/shared/profile");
    } else {
      if (!result.payload?.errors) {
        toast.error(result.payload?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img src="/img/logon.png" alt="Jobsy" />
          <p>Create your account for free</p>
        </div>

        {error && !error.errors && (
          <div className="error-box">
            {error.message || "An error occurred"}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Full Name"
            name="name"
            placeholder="Your name"
            register={register}
            error={errors.name}
            required
          />

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

          <FormInput
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password_confirmation}
            required
          />

          <div className="role-group mb-4">
            <label className="premium-label">I am...</label>

            <div className="role-options">
              {[
                { value: "1", label: "🏢 Client", desc: "I post projects" },
                { value: "2", label: "💼 Freelancer", desc: "I look for work" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`role-card ${selectedRoleId === opt.value ? "active" : ""}`}
                  style={{ cursor: 'pointer', borderRadius: '12px' }}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("role_id")}
                    hidden
                  />

                  <div className="role-title">{opt.label}</div>
                  <div className="role-desc">{opt.desc}</div>
                </label>
              ))}
            </div>
            {errors.role_id && <span className="premium-error-message">{errors.role_id.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`premium-btn premium-btn-primary w-100 ${loading ? "loading" : ""}`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/auth/login" style={{ color: "#185FA5", fontWeight: "600" }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
