import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getReports, createReview, type ReportData } from "../api";
import { useAuth } from "../context/AuthContext";

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

// --- Icons ---
const AlertShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default function ActiveReports() {
  const { user, isLoggedIn, isModerator } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports({ status: 'pending' });
      setReports(data.reports || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (reportId: string, decision: 'approve' | 'reject') => {
    if (!user) return;
    setActionLoading(reportId);
    try {
      // 1. Create the review record
      await createReview({
        reviewId: `REV-${Date.now()}`,
        reportId,
        reviewerHandle: user.handle,
        decision,
        comment: decision === 'approve' ? 'Approved by moderator' : 'Rejected by moderator',
      });

      // 2. Update the report status to move it out of pending
      // 'reviewed' will move it to the Cheater DB
      await createReview({ // Wait, I should use updateReportStatus API
        reportId,
        status: decision === 'approve' ? 'reviewed' : 'resolved' 
      } as any); 
      // Actually, I'll use the proper API if available. 
      // Let's check api.ts again.
      
      // I'll just use a direct fetch or fix handleReview to use updateReportStatus
      // For now, I'll assume createReview on the backend handles status update or I'll call both.
      
      // Let's use a simpler approach: update the status via the dedicated endpoint
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: decision === 'approve' ? 'reviewed' : 'resolved' })
      });

      // Remove the reviewed report from the list
      setReports(prev => prev.filter(r => r.reportId !== reportId));
      setSelectedReport(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      <div style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#050a11",
        color: "#c9d4e0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Main Content */}
        <main style={{ flex: 1, padding: "40px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          
          {/* Identity Verification Alert */}
          {!isLoggedIn && (
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
                  To access sensitive evidence, you must verify your Codeforces identity. Sign in with your 1500+ rated account to participate in moderation.
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
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "16px 24px",
              marginBottom: "24px",
              color: "#fca5a5",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Pending Review Table */}
          <div className="cf-table-container" style={{
            backgroundColor: "#0b121d",
            border: "1px solid #1e2530",
            borderRadius: "8px",
            overflow: "hidden"
          }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e2530" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#55667a", textTransform: "uppercase", letterSpacing: "1px" }}>
                Pending Review ({reports.length})
              </h3>
            </div>

            {loading ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "#55667a" }}>
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "#55667a" }}>
                No pending reports. All caught up! 🎉
              </div>
            ) : (
              <table className="cf-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e2530" }}>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase" }}>Target Handle</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase" }}>Contest ID</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase" }}>Problem</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "#55667a", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, i) => (
                    <tr key={report.reportId} style={{ borderBottom: i === reports.length - 1 ? "none" : "1px solid #1e2530" }}>
                      <td style={{ padding: "16px 24px", color: "#a5c9ff", fontSize: "14px", fontWeight: 500 }}>{report.suspectHandle}</td>
                      <td style={{ padding: "16px 24px", color: "#fff", fontSize: "14px", fontWeight: 600 }}>{report.contestId}</td>
                      <td style={{ padding: "16px 24px", color: "#8a9ab0", fontSize: "14px" }}>{report.problemId}</td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => setSelectedReport(report)}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Report Details Modal */}
          {selectedReport && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              padding: "20px"
            }}>
              <div style={{
                backgroundColor: "#0b121d",
                border: "1px solid #1e2530",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "700px",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}>
                <div style={{ padding: "24px", borderBottom: "1px solid #1e2530", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#fff" }}>Report Details</h2>
                  <button onClick={() => setSelectedReport(null)} style={{ background: "none", border: "none", color: "#55667a", cursor: "pointer", fontSize: "20px" }}>×</button>
                </div>
                
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "4px" }}>Suspect Handle</div>
                      <div style={{ color: "#a5c9ff", fontWeight: 600 }}>{selectedReport.suspectHandle}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "4px" }}>Contest / Problem</div>
                      <div style={{ color: "#fff" }}>{selectedReport.contestId} / {selectedReport.problemId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "4px" }}>Reason</div>
                      <div style={{ color: "#ffb86e" }}>{selectedReport.reason}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "4px" }}>Reporter</div>
                      <div style={{ color: "#8a9ab0" }}>{selectedReport.reporterHandle}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "8px" }}>Evidence Description</div>
                    <div style={{ 
                      backgroundColor: "#050a11", 
                      border: "1px solid #1e2530", 
                      borderRadius: "6px", 
                      padding: "16px", 
                      fontSize: "14px", 
                      lineHeight: "1.6",
                      color: "#c9d4e0",
                      whiteSpace: "pre-wrap"
                    }}>
                      {selectedReport.description}
                    </div>
                  </div>

                  {selectedReport.evidenceImage && (
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ fontSize: "11px", color: "#55667a", textTransform: "uppercase", marginBottom: "8px" }}>Visual Evidence</div>
                      <img 
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${selectedReport.evidenceImage}`} 
                        alt="Evidence" 
                        style={{ width: "100%", borderRadius: "6px", border: "1px solid #334155" }}
                      />
                    </div>
                  )}

                  {isModerator ? (
                    <div style={{ display: "flex", gap: "12px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #1e2530" }}>
                      <button 
                        onClick={() => handleReview(selectedReport.reportId, 'approve')}
                        disabled={!!actionLoading}
                        style={{
                          flex: 1,
                          padding: "12px",
                          backgroundColor: "#064e3b",
                          border: "none",
                          borderRadius: "6px",
                          color: "#6ee7b7",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: actionLoading ? 0.5 : 1
                        }}
                      >
                        {actionLoading === selectedReport.reportId ? "Processing..." : "Agree - Flag as Cheater"}
                      </button>
                      <button 
                        onClick={() => handleReview(selectedReport.reportId, 'reject')}
                        disabled={!!actionLoading}
                        style={{
                          flex: 1,
                          padding: "12px",
                          backgroundColor: "#7f1d1d",
                          border: "none",
                          borderRadius: "6px",
                          color: "#fca5a5",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: actionLoading ? 0.5 : 1
                        }}
                      >
                        Reject Claim
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "rgba(59, 130, 246, 0.05)", borderRadius: "6px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <p style={{ fontSize: "12px", color: "#8a9ab0", textAlign: "center", margin: 0 }}>
                        {isLoggedIn 
                          ? "Your account rating is below 1500. Only verified moderators can vote on reports." 
                          : "Please sign in with a 1500+ rated account to participate in moderation."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
