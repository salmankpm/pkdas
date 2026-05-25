import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/auth/public-doctors");
        setDoctors(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialtyIcons = {
    Cardiologist: "❤️",
    Neurologist: "🧠",
    "Orthopedic Surgeon": "🦴",
    Pediatrician: "👶",
    Dermatologist: "🩺",
    Gynecologist: "🌸",
    General: "⚕️",
  };

  const getIcon = (specialty) =>
    specialtyIcons[specialty] || specialtyIcons["General"];

  return (
    <div className="home-page">
      {/* ── NAV ── */}
      <nav className="home-nav">
        <div className="home-nav__brand">
          <span className="brand-cross">✚</span>
          <span className="brand-name">PK Das Hospital</span>
        </div>
        <button className="home-nav__login" onClick={() => navigate("/login")}>
           Login
        </button>
      </nav>

      {/* ── HERO ── */}
      <header className="home-hero">
        <div className="hero-glow hero-glow--1" />
        <div className="hero-glow hero-glow--2" />
        <div className="hero-content">
          
          <h1 className="hero-title">
            Your health,<br />
            <span className="hero-title--accent">our priority.</span>
          </h1>
          <p className="hero-desc">
            PK Das Hospital has been serving the community since 1995. Our 500-bed
            facility is home to over 50 specialist doctors and a dedicated team of
            1,000+ healthcare professionals.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
            >
              Login to Portal
            </button>
            <a href="#doctors" className="btn-ghost">
              Meet Our Doctors ↓
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Beds</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">50+</span>
            <span className="stat-label">Specialists</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">30yr</span>
            <span className="stat-label">Experience</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Emergency</span>
          </div>
        </div>
      </header>

      {/* ── DOCTORS ── */}
      <section className="doctors-section" id="doctors">
        <div className="doctors-section__header">
          <h2 className="section-title">Our Specialist Doctors</h2>
          <p className="section-sub">
            World-class specialists dedicated to your care
          </p>
        </div>

        {loading ? (
          <div className="doctors-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="doctor-skeleton" />
            ))}
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doc, i) => (
              <div
                key={doc._id}
                className="doctor-card"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="doctor-card__avatar">
                  <span className="doctor-card__icon">
                    {getIcon(doc.specialty)}
                  </span>
                </div>
                <div className="doctor-card__info">
                  <h3 className="doctor-card__name">{doc.name}</h3>
                  <span className="doctor-card__specialty">
                    {doc.specialty || "General Physician"}
                  </span>
                </div>
                <div className="doctor-card__badge">Available</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner__inner">
          <div>
            <h2 className="cta-title">Are you a staff member?</h2>
            <p className="cta-sub">
              Access patient records, appointments, and management tools.
            </p>
          </div>
          <button className="btn-primary btn-primary--large" onClick={() => navigate("/login")}>
            Go to  Login →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer">
        <span className="brand-cross">✚</span>
        <span>PK Das Hospital © {new Date().getFullYear()}</span>
        <span className="footer-sep">·</span>
        <span>Serving since 1995</span>
      </footer>
    </div>
  );
}