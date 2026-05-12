import { useState } from "react";

const responsiveStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; width: 100%; }
  body { overflow-x: hidden; }

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


const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ShieldCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#93b4d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ShieldLarge = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#93b4d4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ReportsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </svg>
);

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

const LeaderboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
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
      {/* Navbar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: "56px",
        borderBottom: "1px solid #1e2530",
        backgroundColor: "#0f1117",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "30px", height: "30px",
            background: "linear-gradient(135deg, #1e2d40, #2a3d55)",
            borderRadius: "6px",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid #2a3d55",
          }}>
            <ShieldIcon />
          </div>
          <span style={{ fontSize: "17px", fontWeight: 600, color: "#d6e4f0" }}>CF Watch</span>
        </div>

        <div className="cf-nav-buttons" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <a className="cf-nav-links" href="#" style={{ color: "#8a9ab0", fontSize: "14px", textDecoration: "none" }}>Reports</a>
          <a className="cf-nav-links" href="#" style={{ color: "#8a9ab0", fontSize: "14px", textDecoration: "none" }}>Appeals</a>
          <button style={{
            padding: "6px 18px",
            background: "transparent",
            border: "1px solid #2e3d50",
            borderRadius: "6px",
            color: "#c9d4e0",
            fontSize: "14px",
            cursor: "pointer",
          }}>Sign In</button>
          <button style={{
            padding: "6px 18px",
            background: "transparent",
            border: "1px solid #3d6080",
            borderRadius: "6px",
            color: "#93b4d4",
            fontSize: "14px",
            cursor: "pointer",
          }}>Sign Up</button>
        </div>
      </nav>

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
            background: "linear-gradient(145deg, #1a2535, #243347)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "32px",
            border: "1px solid #2a3d55",
          }}>
            <ShieldLarge />
          </div>

          <h1 className="cf-h1" style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#dce8f0",
            margin: "0 0 14px",
            letterSpacing: "-0.5px",
          }}>Clinical & Objective Moderation</h1>

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
              placeholder="Search handles or contests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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
              { icon: <DashboardIcon />, label: "Dashboard" },
              { icon: <FlagIcon />, label: "Active Reports" },
              { icon: <DBIcon />, label: "Cheater DB" },
              { icon: <LeaderboardIcon />, label: "Leaderboard" },
            ].map(({ icon, label }) => (
              <button key={label} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "10px 20px",
                background: "#141b26",
                border: "1px solid #1e2a38",
                borderRadius: "8px",
                color: "#9dafc0",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}>
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="cf-action-row" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "64px" }}>
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
            <button style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "10px 24px",
              background: "#151b25",
              border: "1px solid #1e2a38",
              borderRadius: "8px",
              color: "#8a9ab0",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}>
              <FlagIcon /> Appeal Decision
            </button>
          </div>

          {/* Stats */}
          <div className="cf-stats-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            width: "100%",
            maxWidth: "900px",
          }}>
            {[
              { icon: <BanIcon />, value: "1,000+", label: "Verified Cheaters Tagged" },
              { icon: <FileIcon />, value: "5,000+", label: "Reports Processed" },
              { icon: <UserIcon />, value: "200+", label: "Active Reviewers" },
            ].map(({ icon, value, label }) => (
              <div key={label} style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "18px 20px",
                background: "#111620",
                border: "1px solid #1b2333",
                borderRadius: "10px",
              }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: "#141d2b",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  border: "1px solid #1e2a38",
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#d0dce8" }}>{value}</div>
                  <div style={{ fontSize: "12px", color: "#55667a", marginTop: "2px" }}>{label}</div>
                </div>
              </div>
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
            <ShieldCheck />
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="cf-footer" style={{
        borderTop: "1px solid #1b2333",
        padding: "28px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "#c0d0e0", marginBottom: "4px" }}>CF Watch</div>
          <div style={{ fontSize: "12px", color: "#3d4f62" }}>© 2024 CF Community Watch. Clinical & Objective Moderation.</div>
        </div>
        <div className="cf-footer-links" style={{ display: "flex", gap: "24px" }}>
          {["Terms of Service", "Privacy Policy", "Contact Admin", "API Docs"].map(link => (
            <a key={link} href="#" style={{ fontSize: "13px", color: "#4d6070", textDecoration: "none" }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>
    </>
  );
}

export default HomePage;