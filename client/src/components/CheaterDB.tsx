import { useState } from "react";

const responsiveStyles = `
  @media (max-width: 640px) {
    .cf-nav-links { display: none !important; }
    .cf-nav-buttons { gap: 8px !important; }
    .cf-nav-buttons button { padding: 5px 12px !important; font-size: 13px !important; }
    .cf-footer { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
    .cf-footer-links { flex-wrap: wrap !important; gap: 12px !important; }
    .cf-hero { padding: 48px 16px 40px !important; }
    .cf-hero h1 { font-size: 26px !important; }

    .cf-table-container { overflow-x: auto; }
    .cf-table { min-width: 700px; }
    .cf-pagination { flex-wrap: wrap !important; gap: 6px !important; }
  }

  @media (min-width: 641px) and (max-width: 900px) {
    .cf-hero h1 { font-size: 32px !important; }
  }

  .cf-row-hover:hover { background-color: #0d1520 !important; }
  .cf-eye-btn:hover { color: #a5c9ff !important; }
  .cf-page-btn:hover { background-color: #1e2a3a !important; }
`;

// ── Status badge config ─────────────────────────────────────────────────────

type StatusKey = "BANNED" | "UNDER REVIEW" | "VERIFIED CLEAN" | "PENDING";

const statusStyles: Record<StatusKey, { bg: string; color: string }> = {
  "BANNED":         { bg: "#4a1010", color: "#f87171" },
  "UNDER REVIEW":   { bg: "#3a2a00", color: "#fbbf24" },
  "VERIFIED CLEAN": { bg: "#0a2e1e", color: "#34d399" },
  "PENDING":        { bg: "#1e293b", color: "#94a3b8" },
};

function StatusBadge({ status }: { status: StatusKey }) {
  const s = statusStyles[status] ?? statusStyles["PENDING"];
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      padding: "4px 10px",
      borderRadius: "3px",
      textTransform: "uppercase",
      fontFamily: "monospace",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

// ── Evidence bar ────────────────────────────────────────────────────────────

function EvidenceBar({ pct }: { pct: number }) {
  const color =
    pct >= 90 ? "#ef4444" :
    pct >= 70 ? "#f59e0b" :
    pct >= 40 ? "#6b7280" : "#374151";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "80px", height: "6px", backgroundColor: "#1e2530", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: "3px" }} />
      </div>
      <span style={{ fontSize: "13px", color: color, fontWeight: 600, fontFamily: "monospace", minWidth: "34px" }}>
        {pct}%
      </span>
    </div>
  );
}

// ── Eye icon ────────────────────────────────────────────────────────────────

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ── Avatar placeholder ──────────────────────────────────────────────────────

function Avatar({ handle }: { handle: string }) {
  const colors = ["#1d4ed8", "#7c3aed", "#b45309", "#0f766e", "#be185d"];
  const color = colors[handle.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: "24px", height: "24px", borderRadius: "50%",
      backgroundColor: color, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "10px", fontWeight: 700, color: "#fff",
    }}>
      {handle[0].toUpperCase()}
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────────────

type Row = {
  handle: string;
  lastContest: string;
  detectionReason: string;
  evidencePct: number;
  status: StatusKey;
};

const rows: Row[] = [
  { handle: "tourist_fan_99",  lastContest: "CF Round 918 (Div. 2)", detectionReason: "Code Similarity (Plagiarism)",       evidencePct: 95, status: "BANNED" },
  { handle: "AI_Coder_2024",   lastContest: "Edu Round 160",         detectionReason: "LLM Generation Pattern (GPT-4)",    evidencePct: 88, status: "UNDER REVIEW" },
  { handle: "fast_fingers_00", lastContest: "CF Round 917 (Div. 3)", detectionReason: "Suspicious Typing Speed (Bot)",     evidencePct: 99, status: "BANNED" },
  { handle: "clean_slate_xyz", lastContest: "Global Round 24",       detectionReason: "Manual Report (Cleared)",           evidencePct: 12, status: "VERIFIED CLEAN" },
  { handle: "unrated_user_1",  lastContest: "CF Round 915 (Div. 2)", detectionReason: "Multiple Account IP Match",         evidencePct: 75, status: "PENDING" },
];

// ── Main Component ──────────────────────────────────────────────────────────

export default function CheaterDB() {
  const [search, setSearch] = useState("");
  const [currentPage] = useState(1);
  const totalRecords = 1204;

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

        {/* ── Hero / Search ── */}
        <div className="cf-hero" style={{
          padding: "64px 24px 56px",
          textAlign: "center",
          borderBottom: "1px solid #1e2530",
          backgroundColor: "#060d18",
        }}>
          <h1 style={{
            fontSize: "40px",
            fontWeight: 700,
            color: "#a5c9ff",
            marginBottom: "16px",
            letterSpacing: "-0.5px",
          }}>
            Public Cheater Database
          </h1>
          <p style={{
            color: "#8a9ab0",
            fontSize: "15px",
            lineHeight: "1.7",
            maxWidth: "600px",
            margin: "0 auto 32px",
          }}>
            A clinical, transparent record of verified cheating incidents. Search by handle, contest ID, or detection
            method to review detailed moderation actions.
          </p>

          {/* Search box */}
          <div className="cf-search-box" style={{
            display: "flex",
            maxWidth: "580px",
            margin: "0 auto 20px",
            border: "1px solid #2e3d50",
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "#0b121d",
          }}>
            <input
              type="text"
              placeholder="Enter CF handle or Contest ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                padding: "14px 18px",
                color: "#c9d4e0",
                fontSize: "14px",
              }}
            />
            <button style={{
              padding: "14px 24px",
              backgroundColor: "#a5c9ff",
              border: "none",
              color: "#000",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}>
              Search
            </button>
          </div>
        </div>

        {/* ── Table Section ── */}
        <main style={{ flex: 1, padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

          {/* Records count */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "16px",
          }}>
            <span style={{ fontSize: "13px", color: "#55667a" }}>
              Showing <strong style={{ color: "#c9d4e0" }}>1–50</strong> of{" "}
              <strong style={{ color: "#c9d4e0" }}>{totalRecords.toLocaleString()}</strong> records
            </span>
          </div>

          {/* Table */}
          <div className="cf-table-container" style={{
            backgroundColor: "#0b121d",
            border: "1px solid #1e2530",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "24px",
          }}>
            <table className="cf-table" style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e2530", backgroundColor: "#080f19" }}>
                  {[
                    { label: "Handle",           width: "200px" },
                    { label: "Last Contest",      width: "220px" },
                    { label: "Detection Reason",  width: "auto"  },
                    { label: "Evidence Str.",     width: "160px" },
                    { label: "Status",            width: "140px" },
                    { label: "Action",            width: "72px"  },
                  ].map(col => (
                    <th key={col.label} style={{
                      padding: "14px 20px",
                      fontSize: "11px",
                      color: "#55667a",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      fontWeight: 700,
                      width: col.width,
                      whiteSpace: "nowrap",
                    }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="cf-row-hover"
                    style={{
                      borderBottom: i === rows.length - 1 ? "none" : "1px solid #1e2530",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Handle */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Avatar handle={row.handle} />
                        <span style={{ color: "#a5c9ff", fontSize: "14px", fontWeight: 500, fontFamily: "monospace" }}>
                          {row.handle}
                        </span>
                      </div>
                    </td>

                    {/* Last contest */}
                    <td style={{ padding: "16px 20px", color: "#8a9ab0", fontSize: "13px" }}>
                      {row.lastContest}
                    </td>

                    {/* Detection reason */}
                    <td style={{ padding: "16px 20px", color: "#c9d4e0", fontSize: "13px" }}>
                      {row.detectionReason}
                    </td>

                    {/* Evidence bar */}
                    <td style={{ padding: "16px 20px" }}>
                      <EvidenceBar pct={row.evidencePct} />
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "16px 20px" }}>
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Eye action */}
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <button className="cf-eye-btn" style={{
                        background: "transparent",
                        border: "none",
                        color: "#55667a",
                        cursor: "pointer",
                        padding: "4px",
                        display: "inline-flex",
                        transition: "color 0.15s",
                      }}>
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="cf-pagination" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}>
            {["Prev", "1", "2", "3", "...", "25", "Next"].map((p, i) => (
              <button key={i} className="cf-page-btn" style={{
                padding: "6px 12px",
                backgroundColor: p === String(currentPage) ? "#a5c9ff" : "transparent",
                border: p === String(currentPage) ? "none" : "1px solid #1e2530",
                borderRadius: "4px",
                color: p === String(currentPage) ? "#000" : "#8a9ab0",
                fontSize: "13px",
                cursor: p === "..." ? "default" : "pointer",
                fontWeight: p === String(currentPage) ? 700 : 400,
                transition: "background 0.15s",
                minWidth: "36px",
              }}>
                {p}
              </button>
            ))}
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="cf-footer" style={{
          borderTop: "1px solid #1e2530",
          padding: "40px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#dce8f0", marginBottom: "4px" }}>CF Watch</div>
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
