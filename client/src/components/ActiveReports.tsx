import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getReports, createReview, type ReportData } from "../api";
import { useAuth } from "../context/AuthContext";
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
    
    /* Active Reports custom mobile rules */
    .cf-alert-card { flex-direction: column !important; gap: 16px !important; text-align: center !important; padding: 24px 16px !important; }
    .cf-alert-card > div { display: flex; justify-content: center; width: 100%; }
    .cf-alert-card button { width: 100% !important; margin-bottom: 8px; }
    
    .cf-modal-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
    .cf-modal-buttons { flex-direction: column !important; gap: 10px !important; }
    .cf-modal-buttons button { width: 100% !important; padding: 14px !important; }
    
    .cf-table-container { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
    .cf-table { min-width: 500px !important; }
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
  const [comment, setComment] = useState('');

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
    if (!user || !comment.trim()) return;
    setActionLoading(reportId);
    try {
      // 1. Create the review record
      await createReview({
        reviewId: `REV-${Date.now()}`,
        reportId,
        reviewerHandle: user.handle,
        decision,
        comment: comment.trim(),
      });

      // 2. Update the report status to move it out of pending (using the dedicated endpoint)
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api'}/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          status: decision === 'approve' ? 'reviewed' : 'resolved',
          moderatorComment: comment.trim()
        })
      });

      // Remove the reviewed report from the list
      setReports(prev => prev.filter(r => r.reportId !== reportId));
      setSelectedReport(null);
      setComment('');
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
        backgroundColor: "var(--bg-main)",
        color: "var(--text-main)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}>
        {/* Main Content */}
        <main style={{ padding: "40px 24px 0px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          
          {/* Page Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">Active Reports</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "700px" }}>
              Help moderate and maintain community integrity by peer-reviewing pending contest violation reports.
            </p>
          </div>

          {/* Identity Verification Alert */}
          {!isLoggedIn && (
            <div className="bg-surface border border-surface-border rounded-lg p-6 sm:p-8 mb-10 flex flex-col sm:flex-row gap-6 items-start transition-colors duration-300">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div style={{ padding: "10px", backgroundColor: "rgba(217, 119, 6, 0.1)", borderRadius: "8px" }}>
                  <AlertShield />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left w-full">
                <h2 className="text-lg sm:text-xl font-semibold text-text-main mb-2">Identity Verification Required</h2>
                <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-3xl">
                  To access sensitive evidence, you must verify your Codeforces identity. Sign in with your 1500+ rated account to participate in moderation.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start">
                  <NavLink to="/auth?mode=signin" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-transparent border border-surface-border rounded text-sm text-text-main hover:bg-surface-dim transition-all font-medium cursor-pointer">
                      Sign In
                    </button>
                  </NavLink>
                  <NavLink to="/auth?mode=signup" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-surface-dim border border-surface-border rounded text-sm text-text-main hover:bg-surface transition-all font-medium cursor-pointer">
                      Sign Up
                    </button>
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
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-main)",
            borderRadius: "8px",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-main)" }}>
              <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "var(--text-label)", textTransform: "uppercase", letterSpacing: "1px" }}>
                Pending Review ({reports.length})
              </h3>
            </div>

            {loading ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-label)" }}>
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-label)" }}>
                No pending reports. All caught up! 🎉
              </div>
            ) : (
              <table className="cf-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-main)" }}>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--text-label)", textTransform: "uppercase" }}>Suspect Handle</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--text-label)", textTransform: "uppercase" }}>Contest ID</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--text-label)", textTransform: "uppercase" }}>Problem</th>
                    <th style={{ padding: "16px 24px", fontSize: "12px", color: "var(--text-label)", textTransform: "uppercase", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, i) => (
                    <tr key={report.reportId} style={{ borderBottom: i === reports.length - 1 ? "none" : "1px solid var(--border-main)" }}>
                      <td style={{ padding: "16px 24px", color: "var(--primary-light)", fontSize: "14px", fontWeight: 500 }}>{report.suspectHandle}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-main)", fontSize: "14px", fontWeight: 600 }}>{report.contestId}</td>
                      <td style={{ padding: "16px 24px", color: "var(--text-muted)", fontSize: "14px" }}>{report.problemId}</td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => setSelectedReport(report)}
                            style={{
                              padding: "6px 16px",
                              backgroundColor: "var(--bg-input)",
                              border: "1px solid var(--border-input)",
                              borderRadius: "4px",
                              color: "var(--text-main)",
                              fontSize: "12px",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
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
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-main)",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "700px",
                maxHeight: "90vh",
                overflow: "auto",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s ease",
              }}>
                <div style={{ padding: "24px", borderBottom: "1px solid var(--border-main)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-main)" }}>Report Details</h2>
                  <button onClick={() => { setSelectedReport(null); setComment(''); }} style={{ background: "none", border: "none", color: "var(--text-label)", cursor: "pointer", fontSize: "20px" }}>×</button>
                </div>
                
                <div style={{ padding: "24px" }}>
                  <div className="cf-modal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "4px" }}>Suspect Handle</div>
                      <div style={{ color: "var(--primary-light)", fontWeight: 600 }}>{selectedReport.suspectHandle}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "4px" }}>Contest / Problem</div>
                      <div style={{ color: "var(--text-main)" }}>{selectedReport.contestId} / {selectedReport.problemId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "4px" }}>Reason</div>
                      <div style={{ color: "#ffb86e" }}>{selectedReport.reason}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "8px" }}>Evidence Description</div>
                    <div style={{ 
                      backgroundColor: "var(--bg-main)", 
                      border: "1px solid var(--border-main)", 
                      borderRadius: "6px", 
                      padding: "16px", 
                      fontSize: "14px", 
                      lineHeight: "1.6",
                      color: "var(--text-main)",
                      whiteSpace: "pre-wrap",
                      transition: "all 0.3s ease",
                    }}>
                      {selectedReport.description}
                    </div>
                  </div>

                  {selectedReport.evidenceImage && (
                    <div style={{ marginBottom: "24px" }}>
                      <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "8px" }}>Visual Evidence</div>
                      <img 
                        src={selectedReport.evidenceImage.startsWith('http') 
                          ? selectedReport.evidenceImage 
                          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${selectedReport.evidenceImage}`} 
                        alt="Evidence" 
                        style={{ width: "100%", borderRadius: "6px", border: "1px solid var(--border-main)" }}
                      />
                    </div>
                  )}

                  {isModerator ? (
                    <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-main)" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "11px", color: "var(--text-label)", textTransform: "uppercase", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                          <span>Moderator Verification Rationale <span style={{ color: "#ef4444" }}>*</span></span>
                        </div>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Please provide a clear and concise reason/comment to support your decision..."
                          rows={3}
                          style={{
                            width: "100%",
                            backgroundColor: "var(--bg-main)",
                            border: "1px solid var(--border-main)",
                            borderRadius: "8px",
                            padding: "12px",
                            fontSize: "14px",
                            color: "var(--text-main)",
                            outline: "none",
                            resize: "none",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                      
                      <div className="cf-modal-buttons" style={{ display: "flex", gap: "12px" }}>
                        <button 
                          onClick={() => handleReview(selectedReport.reportId, 'approve')}
                          disabled={!comment.trim() || !!actionLoading}
                          style={{
                            flex: 1,
                            padding: "12px",
                            backgroundColor: "#064e3b",
                            border: "none",
                            borderRadius: "6px",
                            color: "#6ee7b7",
                            fontWeight: 600,
                            cursor: comment.trim() ? "pointer" : "not-allowed",
                            opacity: (actionLoading || !comment.trim()) ? 0.4 : 1
                          }}
                        >
                          {actionLoading === selectedReport.reportId ? "Processing..." : "Agree - Flag as Cheater"}
                        </button>
                        <button 
                          onClick={() => handleReview(selectedReport.reportId, 'reject')}
                          disabled={!comment.trim() || !!actionLoading}
                          style={{
                            flex: 1,
                            padding: "12px",
                            backgroundColor: "#7f1d1d",
                            border: "none",
                            borderRadius: "6px",
                            color: "#fca5a5",
                            fontWeight: 600,
                            cursor: comment.trim() ? "pointer" : "not-allowed",
                            opacity: (actionLoading || !comment.trim()) ? 0.4 : 1
                          }}
                        >
                          Reject Claim
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "rgba(59, 130, 246, 0.05)", borderRadius: "6px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
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

        <Footer />
      </div>
    </>
  );
}
