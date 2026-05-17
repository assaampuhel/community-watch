import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getReports, type ReportData } from "../api";
import Footer from "./Footer";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7a8d" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function CheaterDB() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || "";

  const [search, setSearch] = useState(initialSearch);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    async function fetchCheaters() {
      setLoading(true);
      try {
        // Always fetch both 'reviewed' and 'pending' records in parallel to display verified records and active reviews together
        const [reviewedRes, pendingRes] = await Promise.all([
          getReports({ status: 'reviewed', search }),
          getReports({ status: 'pending', search })
        ]);
        setReports([...reviewedRes.reports, ...pendingRes.reports]);
        setTotal(reviewedRes.total + pendingRes.total);
      } catch (err) {
        console.error("Failed to fetch cheater database", err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(fetchCheaters, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [search]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedReports = reports.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-background text-text-main font-sans flex flex-col transition-colors duration-300">
      <div className="bg-background border-b border-surface-border py-12 sm:py-16 px-4 sm:px-6 text-center transition-colors duration-300">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">Public Cheater Database</h1>
        <p className="text-sm text-text-muted max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          A clinical, transparent record of verified cheating incidents across competitive programming platforms.
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search by CF handle or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-dim border border-surface-border rounded-lg py-3 px-12 text-sm outline-none focus:border-primary text-text-main transition-all"
          />
          <span className="absolute left-4 top-4"><SearchIcon /></span>
        </div>
      </div>

      <main className="px-4 sm:px-8 pt-8 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-text-label uppercase tracking-widest">
            Verified Records ({total})
          </h3>
        </div>

        <div className="bg-surface border border-surface-border rounded-lg overflow-hidden shadow-2xl overflow-x-auto -webkit-overflow-scrolling-touch transition-colors duration-300">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-surface-dim border-b border-surface-border">
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Handle</th>
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Contest</th>
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Prob</th>
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Reason</th>
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Status</th>
                <th className="px-6 py-4 text-[11px] text-text-label uppercase">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-text-label">Updating records...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-text-label">No verified records found matching your search.</td></tr>
              ) : (
                displayedReports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-surface-dim transition-colors">
                    <td className="px-6 py-4 font-mono text-primary text-sm">{report.suspectHandle}</td>
                    <td className="px-6 py-4 text-sm text-text-main font-medium">{report.contestId}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{report.problemId}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{report.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-[3px] text-[10px] font-bold uppercase tracking-wider ${
                        report.status === 'resolved' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : report.status === 'reviewed'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {report.status === 'reviewed' 
                          ? 'cheater' 
                          : report.status === 'pending'
                            ? 'under review'
                            : report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="px-3.5 py-1.5 bg-surface-dim border border-surface-border rounded text-xs font-semibold text-text-main hover:text-white hover:bg-surface hover:border-primary transition-all cursor-pointer shadow-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Premium Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2 py-4 border-t border-surface-border/30 animate-fade-in transition-colors duration-300">
            <span className="text-xs text-text-label text-center sm:text-left">
              Showing <span className="text-primary font-medium">{startIndex + 1}</span> to{" "}
              <span className="text-primary font-medium">
                {Math.min(startIndex + itemsPerPage, reports.length)}
              </span>{" "}
              of <span className="text-primary font-medium">{reports.length}</span> records
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-surface border border-surface-border text-xs font-semibold rounded text-text-main hover:bg-surface-dim hover:border-surface-border hover:text-white disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-surface-border disabled:hover:text-text-main disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-primary text-background shadow-lg shadow-primary/10 font-bold"
                      : "bg-surface border border-surface-border text-text-main hover:bg-surface-dim hover:border-surface-border hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-surface border border-surface-border text-xs font-semibold rounded text-text-main hover:bg-surface-dim hover:border-surface-border hover:text-white disabled:opacity-40 disabled:hover:bg-surface disabled:hover:border-surface-border disabled:hover:text-text-main disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-surface border border-surface-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl transition-colors duration-300">
              <div className="px-6 py-4 border-b border-surface-border flex justify-between items-center bg-surface-dim">
                <h2 className="text-lg font-bold text-text-main">Record Verification</h2>
                <button onClick={() => setSelectedReport(null)} className="text-text-label hover:text-text-main text-xl">×</button>
              </div>
              <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-label font-bold mb-1">Suspect</p>
                    <p className="text-primary font-mono text-lg">{selectedReport.suspectHandle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-label font-bold mb-1">Context</p>
                    <p className="text-text-main">{selectedReport.contestId} / {selectedReport.problemId}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest text-text-label font-bold mb-2">Evidence & Rationale</p>
                  <div className="bg-background border border-surface-border p-4 rounded text-sm text-text-muted leading-relaxed whitespace-pre-wrap font-sans transition-colors duration-300">
                    {selectedReport.description}
                  </div>
                </div>
                {selectedReport.moderatorComment && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">Moderator Decision & Rationale</p>
                    <div className="bg-surface-dim border border-surface-border p-4 rounded text-sm text-text-main leading-relaxed whitespace-pre-wrap font-sans transition-colors duration-300">
                      {selectedReport.moderatorComment}
                    </div>
                  </div>
                )}
                {selectedReport.evidenceImage && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-text-label font-bold mb-2">Attachment</p>
                    <img 
                      src={selectedReport.evidenceImage.startsWith('http')
                        ? selectedReport.evidenceImage
                        : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${selectedReport.evidenceImage}`}
                      alt="Evidence" 
                      className="w-full rounded border border-surface-border shadow-inner"
                    />
                  </div>
                )}
                <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-label font-bold">Report ID</p>
                    <p className="text-xs font-mono text-text-label">{selectedReport.reportId}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="w-full sm:w-auto px-6 py-2 bg-surface-dim border border-surface-border text-text-main text-sm rounded hover:bg-surface hover:text-white transition-all cursor-pointer"
                  >
                    Close Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
