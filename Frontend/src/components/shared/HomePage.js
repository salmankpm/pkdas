import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../../styles/HomePage.css";

const SERVICES = [
  "Cardiology",
  "Anaesthesiology",
  "Bariatric Surgery",
  "Blood Bank",
  "Endocrinology & Diabetology",
  "Medical Oncology",
];

const DOCTOR_IMAGES = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=350&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=350&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=350&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=350&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=350&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=350&fit=crop&crop=face",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState(1);
  const [service, setService] = useState("Heart Problem");
  const [date, setDate] = useState("");
  const [phone, setPhone] = useState("");

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveService((prev) => (prev + 1) % SERVICES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hp">
      {/* ── NAV ── */}
      <nav className="hp-nav">
        <div className="hp-nav__brand">
          <span className="hp-nav__logo">PK DAS</span>
          <ul className="hp-nav__links">
            <li className="active">Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Services</li>
          </ul>
        </div>
        <button className="hp-btn hp-btn--outline" onClick={() => navigate("/login")}>
          Login
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hp-hero">
        <div className="hp-hero__overlay" />
        <div className="hp-hero__content">
          <h1 className="hp-hero__title">
            A Great Place care<br />for yourself
          </h1>
          <p className="hp-hero__sub">
            Medical recover is most focused in helping you discover your most beautiful smile
          </p>
          <button className="hp-btn hp-btn--outline-white" onClick={() => navigate("/login")}>
            Book Appointment
          </button>
        </div>

        {/* Doctor photos strip */}
        <div className="hp-hero__doctors">
          <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop&crop=face" alt="Doctor" />
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=520&fit=crop&crop=face" alt="Doctor" className="center" />
          <img src="https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&h=500&fit=crop&crop=face" alt="Doctor" />
        </div>

        {/* Booking bar */}
        <div className="hp-booking-bar">
          <div className="hp-booking-bar__field">
            <label>Choose Services</label>
            <select value={service} onChange={e => setService(e.target.value)}>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="hp-booking-bar__divider" />
          <div className="hp-booking-bar__field">
            <label>Choose Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
          </div>
          <div className="hp-booking-bar__divider" />
          <div className="hp-booking-bar__field">
            <label>Contact Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 968 727 9122" />
          </div>
          <button className="hp-btn hp-btn--teal" onClick={() => navigate("/login")}>
            Book Appointment
          </button>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="hp-services">
        <div className="hp-services__left">
          <h2>See what we provide to<br />keep you healthy</h2>
          <p>
            With World-class Preventive, Prescriptive & Curative Medical Practices
            Sterling has been at the helm of Nurturing Healthy Living Since the Turn of the New Century.
          </p>
        </div>
        <div className="hp-services__list">
          {SERVICES.map((s, i) => (
            <div
              key={s}
              className={`hp-services__item ${i === activeService ? "active" : ""}`}
              onClick={() => setActiveService(i)}
            >
              {s}
              {i === activeService && <span className="hp-services__bar" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="hp-stats">
        <div className="hp-stats__circle">
          <span className="hp-stats__num">50+</span>
          <span className="hp-stats__label">Qualified Doctors</span>
          <p>Medical experts present in our clinic</p>
        </div>
        <div className="hp-stats__circle">
          <span className="hp-stats__num">99%</span>
          <span className="hp-stats__label">Recover Patients</span>
          <p>You & your life is more important to us for growth</p>
        </div>
        <div className="hp-stats__circle">
          <span className="hp-stats__num">98%</span>
          <span className="hp-stats__label">Satisfaction Rate</span>
          <p>More than 10,000+ satisfy by our team</p>
        </div>
      </section>

      {/* ── DOCTORS GRID ── */}
      <section className="hp-doctors" id="doctors">
        <div className="hp-doctors__header">
          <h2>Meet Our Specialist Doctors</h2>
          <p>World-class specialists dedicated to your care</p>
        </div>
        {loading ? (
          <div className="hp-doctors__grid">
            {[...Array(6)].map((_, i) => <div key={i} className="hp-doc-skeleton" />)}
          </div>
        ) : (
          <div className="hp-doctors__grid">
            {doctors.map((doc, i) => (
              <div key={doc._id} className="hp-doc-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="hp-doc-card__img-wrap">
                  <img src={DOCTOR_IMAGES[i % DOCTOR_IMAGES.length]} alt={doc.name} />
                  <div className="hp-doc-card__overlay">
                    <button className="hp-btn hp-btn--teal-sm" onClick={() => navigate("/login")}>
                      Book Now
                    </button>
                  </div>
                </div>
                <div className="hp-doc-card__info">
                  <h3>{doc.name}</h3>
                  <span>{doc.specialty || "General Physician"}</span>
                  <div className="hp-doc-card__badge">● Available</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="hp-footer-cta">
        <div className="hp-footer-cta__bg" />
        <div className="hp-footer-cta__content">
          <span className="hp-footer-cta__logo">PK DAS</span>
          <p>Check out for more</p>
          <button className="hp-btn hp-btn--outline-white" onClick={() => navigate("/login")}>
            Staff Login →
          </button>
        </div>
      </section>
    </div>
  );
}