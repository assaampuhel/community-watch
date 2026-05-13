
import { useVerifyHandle } from "./VerifyHandle";
import { NavLink } from "react-router-dom";
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
    /* Table Mobile Adjustments */
    .cf-table-container { overflow-x: auto; }
    .cf-table { min-width: 600px; }
  }

  @media (min-width: 641px) and (max-width: 900px) {
    .cf-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .cf-review-section { margin: 0 24px 48px !important; }
  }
`;

// --- New Icons for the Appeals View ---
const AlertShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);



export default function ActiveReports() {
  const {
    canModerate,
    } = useVerifyHandle();


  const pendingReviews = [
    { handle: 'TouristyCoder', contest: 'Div2 #880' },
    { handle: 'SpeedyGon', contest: 'Edu #145' },
    { handle: 'O(1)Master', contest: 'Div1 #879' },
    { handle: 'dp_enjoyer', contest: 'Div3 #878' },
  ];

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#050a11", // Matched to exact background in image
        color: "#c9d4e0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Main Content */}
        <main style={{ flex: 1, padding: "40px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          
          {/* Identity Verification Alert */}
          <div style={{
            backgroundColor: "#0b121d",
            border: "1px solid #1e2530",
            borderRadius: "8px",
            padding: "32px",
            marginBottom: "40px",
            display: "flex",
            gap: "24px"
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ padding: "10px", backgroundColor: "rgba(217, 119, 6, 0.1)", borderRadius: "8px" }}>
                <AlertShield />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>Identity Verification Required</h2>
              <p style={{ color: "#8a9ab0", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", maxWidth: "700px" }}>
                To access sensitive evidence, you must verify your Codeforces identity via the Blank Submission method. Submit a compilation error to problem 1A to confirm ownership of the linked 1500+ rated account.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <NavLink to="/auth?mode=signin">
                <button style={{
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1px solid #334155",
                  borderRadius: "4px",
                  color: "#c9d4e0",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}>Sign In</button>
                </NavLink>
                <NavLink to="/auth?mode=signup">
                <button style={{
                  padding: "8px 20px",
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}>Sign Up</button>
                </NavLink>
              </div>
            </div>
          </div>

          {/* Pending Review Table */}
          <div className="cf-table-container" style={{
            backgroundColor: "#0b121d",
            border: "1px solid #1e2530",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e2530" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#55667a", textTransform: "uppercase", letterSpacing: "1px" }}>
                Pending Review (4)
              </h3>
            </div>
            <table className="cf-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2530" }}>
                  <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase" }}>Target Handle</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase" }}>Contest</th>
                  <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingReviews.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i === pendingReviews.length - 1 ? "none" : "1px solid #1e2530" }}>
                    <td style={{ padding: "16px 24px", color: "#a5c9ff", fontSize: "14px", fontWeight: 500 }}>{row.handle}</td>
                    <td style={{ padding: "16px 24px", color: "#8a9ab0", fontSize: "14px" }}>{row.contest}</td>
                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "4px",
                            color: "#fff",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          View
                        </button>

                        {canModerate && (
                          <>
                            <button
                              style={{
                                padding: "4px 12px",
                                backgroundColor: "#064e3b",
                                border: "none",
                                borderRadius: "4px",
                                color: "#6ee7b7",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              Agree
                            </button>

                            <button
                              style={{
                                padding: "4px 12px",
                                backgroundColor: "#7f1d1d",
                                border: "none",
                                borderRadius: "4px",
                                color: "#fca5a5",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {/* Footer */}
        <footer className="cf-footer" style={{
          borderTop: "1px solid #1e2530",
          padding: "40px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto"
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#dce8f0", marginBottom: "4px" }}>CF Community Watch</div>
            <div style={{ fontSize: "12px", color: "#55667a" }}>© 2024 CF Community Watch. Clinical & Objective Moderation.</div>
          </div>
          <div className="cf-footer-links" style={{ display: "flex", gap: "24px" }}>
            {["Terms of Service", "Privacy Policy", "Contact Admin", "API Docs"].map(link => (
              <a key={link} href="#" style={{ fontSize: "13px", color: "#55667a", textDecoration: "none" }}>{link}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}

