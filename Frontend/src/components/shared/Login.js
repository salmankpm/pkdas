import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "../../../styles/Login.css";

const roleHome = {
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/receptionist",
};

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately to their dashboard
  useEffect(() => {
    if (user) navigate(roleHome[user.role] || "/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate(roleHome[res.data.role] || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel — branding */}
       <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">✚</div>
          <h1>PK Das Hospital</h1>
          <p>Hospital Management System</p>
        </div>
 
        <div className="about-section">
          <h2 className="about-title">About Our Hospital</h2>
          <p className="about-desc">
            PK Das Hospital has been serving the community since 1995 with a commitment
            to compassionate, cutting-edge healthcare. Our 500-bed facility is home to
            over 50 specialist doctors and a dedicated team of 1,000+ healthcare professionals.
          </p>
        </div>
 
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Hospital Beds</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Specialist Doctors</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">30+</span>
            <span className="stat-label">Years of Service</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50k+</span>
            <span className="stat-label">Patients Annually</span>
          </div>
        </div>
 
        <div className="about-services">
          <p className="services-label">OUR SPECIALTIES</p>
          <div className="service-item"> Cardiology &amp; Heart Surgery</div>
          <div className="service-item"> Neurology &amp; Neurosurgery</div>
          <div className="service-item"> Orthopedics &amp; Trauma Care</div>
          <div className="service-item"> Pediatrics &amp; Neonatal ICU</div>
        </div>
 
        <div className="about-contact">
          <div className="contact-item">  Perinthalmanna City, Kerala</div>
          <div className="contact-item"> +91 98765 43210</div>
          <div className="contact-item"> www.pkdas-hospital.com</div>
        </div>
      </div>

      {/* Right panel — login form ONLY (no signup) */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-icon">✚</div>
          <h2>Sign In</h2>
          <p className="login-sub">Enter your credentials to access your dashboard</p>

          {error && <div className="alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@hospital.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}