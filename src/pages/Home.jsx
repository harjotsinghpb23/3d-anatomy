import { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm({ onLogin }) {
  const [userId, setUserId] = useState("student");
  const [passcode, setPasscode] = useState("anatomy123");

  return (
    <form className="login-form" onSubmit={onLogin}>
      <label htmlFor="user-id">Demo User ID</label>
      <input
        id="user-id"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
        placeholder="Enter any user ID"
      />
      <label htmlFor="passcode">Demo Passcode</label>
      <input
        id="passcode"
        type="password"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        required
        placeholder="Enter any passcode"
      />
      <button className="button" type="submit">
        Start Exploring Catalogue →
      </button>
    </form>
  );
}

function Home({ isLoggedIn, onLogin }) {
  const quickOrgans = [
    { id: "brain", name: "Brain", icon: "🧠", desc: "Cranial Nerves & Stem" },
    { id: "heart", name: "Heart", icon: "🫀", desc: "Chambers & Coronary" },
    { id: "skull", name: "Skull", icon: "💀", desc: "Cranial Bones" },
    { id: "ear", name: "Inner Ear", icon: "👂", desc: "Cochlea & Labyrinth" },
    { id: "eye", name: "Eye", icon: "👁️", desc: "Optical Layers (Smooth)" },
    { id: "body", name: "Full Skeleton", icon: "🦴", desc: "Axial & Appendicular" }
  ];

  return (
    <div className="container">
      {/* Top Hero Grid */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-left">
          <p className="eyebrow">Medical & Educational 3D Platform</p>
          <h1 id="hero-title">3D Human Anatomy Visualizer</h1>
          <p className="hero-copy">
            An advanced interactive web environment for learning human anatomy
            through real-time 3D WebGL models, structured clinical study guides, and
            deep organ exploration.
          </p>
          <div className="hero-button-group">
            <Link className="button" to="/anatomy">
              Explore Full Catalogue (12 Models) →
            </Link>
            {!isLoggedIn && (
              <button
                className="button button-secondary"
                onClick={onLogin}
              >
                Quick 1-Click Login
              </button>
            )}
          </div>
        </div>

        <div className="hero-right">
          {isLoggedIn ? (
            <aside className="login-panel">
              <h2>Welcome to Anatomy Studio!</h2>
              <p>You have active student access to all 3D anatomy modules.</p>
              <Link className="button" to="/anatomy" style={{ width: "100%", textAlign: "center" }}>
                Browse Anatomy Catalogue →
              </Link>
            </aside>
          ) : (
            <aside className="login-panel">
              <h2>Demo Student Login</h2>
              <p>Sign in to unlock interactive 3D models and save favourites.</p>
              <LoginForm onLogin={onLogin} />
            </aside>
          )}
        </div>
      </section>

      {/* 3D Full Body Interactive Showcase */}
      <section className="home-showcase-section" aria-labelledby="showcase-title">
        <div className="showcase-header">
          <div>
            <p className="eyebrow">Interactive Whole-Body Anatomy</p>
            <h2 id="showcase-title">Full Human Body & Skeletal Framework</h2>
          </div>
          <Link className="button button-small" to="/anatomy/body">
            Open Fullscreen 3D Body →
          </Link>
        </div>

        <div className="showcase-card-grid">
          <div className="showcase-viewer-container">
            <iframe
              className="showcase-iframe"
              title="Full Body Human Skeleton Anatomy"
              src="/v2/viewer.html?uid=11b57ebfcf6c4e3b88d0cbe618ee70a7&name=Full%20Human%20Body%20Skeleton&author=projectkaizen"
              allow="autoplay; fullscreen; xr-spatial-tracking"
            ></iframe>
            <div className="showcase-overlay-badge">
              <span>🧍 Full Body 3D WebGL (360° Interactive View)</span>
            </div>
          </div>

          <div className="showcase-organ-nav">
            <h3>Quick Organ Focus</h3>
            <p className="showcase-organ-sub">Click any organ to inspect its detailed 3D structure:</p>
            <div className="quick-organ-list">
              {quickOrgans.map((organ) => (
                <Link
                  key={organ.id}
                  to={`/anatomy/${organ.id}`}
                  className="quick-organ-item"
                >
                  <span className="quick-organ-icon">{organ.icon}</span>
                  <div>
                    <strong>{organ.name}</strong>
                    <span>{organ.desc}</span>
                  </div>
                  <span className="quick-organ-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="intro-section" aria-labelledby="study-title">
        <p className="eyebrow">Pedagogical Design</p>
        <h2 id="study-title">Anatomical Accuracy & Modern Web Standards</h2>
        <p>
          Every structure is paired with a verified open-access 3D mesh (CC-BY-4.0),
          zero-latency SVG preview illustrations, multi-tier anatomical study points,
          and client-side favourites persistence for seamless viva revision.
        </p>
      </section>
    </div>
  );
}

export default Home;
