import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const responsiveStyles = `
  @media (max-width: 640px) {
    .cf-nav-links { display: none !important; }
    .cf-nav-buttons { gap: 8px !important; }
    .cf-nav-buttons button { padding: 5px 12px !important; font-size: 13px !important; }
    .cf-stats-grid { grid-template-columns: 1fr !important; }
    .cf-nav-btns-row { flex-direction: column !important; align-items: stretch !important; }
    .cf-nav-btns-row button { justify-content: center; }
    .cf-action-row { flex-direction: column !important; align-items: stretch !important; }
    .cf-action-row button { justify-content: center; }
    .cf-footer { flex-direction: column !important; align-items: flex-start !important; }
    .cf-footer-links { flex-wrap: wrap !important; gap: 12px !important; }
    .cf-hero { padding-top: 48px !important; padding-bottom: 40px !important; }
    .cf-h1 { font-size: 26px !important; }
    .cf-review-section { margin: 0 16px 40px !important; padding: 40px 16px !important; }
  }

  @media (min-width: 641px) and (max-width: 900px) {
    .cf-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .cf-review-section { margin: 0 24px 48px !important; }
  }
`;




const FlagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const DBIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);



const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7a8d" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function StatCard({ icon, target, suffix, label }: { icon: any, target: number, suffix: string, label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutProgress = 1 - (1 - progress) * (1 - progress);
      const currentCount = Math.floor(easeOutProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "24px 20px",
      background: "#0b121d",
      border: "1px solid #1e2530",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      minHeight: "100px",
      boxSizing: "border-box",
      height: "100%"
    }}>
      <div style={{
        width: "48px", height: "48px",
        background: "rgba(165, 201, 255, 0.05)",
        borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        border: "1px solid rgba(165, 201, 255, 0.1)",
        color: "#a5c9ff"
      }}>
        {icon}
      </div>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        flex: 1,
        minWidth: 0
      }}>
        <div style={{ fontSize: "24px", fontWeight: 800, color: "#fff", lineHeight: "1.1", letterSpacing: "-0.01em" }}>
          {count.toLocaleString()}{suffix}
        </div>
        <div style={{ fontSize: "13px", color: "#6b7a8d", marginTop: "6px", fontWeight: 500, lineHeight: "1.3" }}>{label}</div>
      </div>
    </div>
  );
}

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93b4d4" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93b4d4" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const BanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#93b4d4" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

function HomePage() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/cheaters?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
    <style>{responsiveStyles}</style>
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "#0f1117",
      color: "#c9d4e0",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      
      {/* Hero */}
      <main style={{ flex: 1 }}>
        <section className="cf-hero" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "64px",
          paddingLeft: "24px",
          paddingRight: "24px",
          textAlign: "center",
        }}>
          {/* Shield Icon */}
          <div style={{
            width: "80px", height: "80px",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "32px",
            overflow: "hidden"
          }}>
            <img src="/logo.png" alt="CF Community Watch" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <h1 className="cf-h1" style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#dce8f0",
            margin: "0 0 14px",
            letterSpacing: "-0.5px",
          }}>CF Community Watch</h1>

          <p style={{
            fontSize: "15px",
            color: "#6b7a8d",
            margin: "0 0 36px",
          }}>Ensuring fairness in every contest through community-driven integrity.</p>

          {/* Search */}
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "560px",
            marginBottom: "32px",
          }}>
            <span style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
            }}>
              <SearchIcon />
            </span>
            <input
              
              type="text"
              placeholder="Search handles"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              style={{
                width: "100%",
                padding: "11px 16px 11px 40px",
                background: "#151b25",
                border: "1px solid #1e2a38",
                borderRadius: "8px",
                color: "#c9d4e0",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="cf-nav-btns-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
             {[
              { icon: <FlagIcon />, label: "Active Reports", to: "/reports" },
              { icon: <DBIcon />, label: "Cheater DB", to: "/cheaters" },
            ].map(({ icon, label, to }) => (
              <NavLink
                key={label}
                to={to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  background: isActive ? "#1f2a3a" : "#141b26",
                  border: isActive ? "1px solid #3a4a60" : "1px solid #1e2a38",
                  borderRadius: "8px",
                  color: isActive ? "#ffffff" : "#9dafc0",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                })}
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="cf-action-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "64px" }}>
            <NavLink to="/report">
              <button style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "10px 24px",
                background: "#1a3a5c",
                border: "1px solid #2a5580",
                borderRadius: "8px",
                color: "#93b4d4",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}>
                <PlusIcon /> New Report
              </button>
            </NavLink>
          </div>

          {/* Stats */}
          <div className="cf-stats-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 20px",
            boxSizing: "border-box"
          }}>
            {[
              { icon: <BanIcon />, target: 1000, suffix: "+", label: "Verified Cheaters Tagged" },
              { icon: <FileIcon />, target: 5000, suffix: "+", label: "Reports Processed" },
              { icon: <UserIcon />, target: 200, suffix: "+", label: "Active Reviewers" },
            ].map(({ icon, target, suffix, label }) => (
              <StatCard key={label} icon={icon} target={target} suffix={suffix} label={label} />
            ))}
          </div>
        </section>

        {/* Join Review Board */}
        <section className="cf-review-section" style={{
          margin: "0 40px 60px",
          background: "#111620",
          border: "1px solid #1b2333",
          borderRadius: "12px",
          padding: "56px 24px",
          textAlign: "center",
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "50px", height: "50px", borderRadius: "10px", overflow: "hidden" }}>
              <img src="/logo.png" alt="CF Community Watch" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "#d0dce8",
            margin: "0 0 16px",
          }}>Join the Review Board</h2>
          <p style={{
            fontSize: "14px",
            color: "#6b7a8d",
            maxWidth: "480px",
            margin: "0 auto 32px",
            lineHeight: "1.65",
          }}>
            We rely on experienced community members to maintain integrity. If you have a rating of 1500+ and want to help keep contests fair, apply to become a reviewer.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <NavLink to="/auth?mode=signin">
            <button style={{
              padding: "10px 28px",
              background: "#141b26",
              border: "1px solid #1e2a38",
              borderRadius: "8px",
              color: "#8a9ab0",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}>Sign In</button>
            </NavLink>
            <NavLink to="/auth?mode=signup">
            <button style={{
              padding: "10px 28px",
              background: "#1a3a5c",
              border: "1px solid #2a5580",
              borderRadius: "8px",
              color: "#93b4d4",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}>Apply Now</button>
            </NavLink>
          </div>
        </section>
      </main>

      <Footer />
    </div>
    </>
  );
}

export default HomePage;