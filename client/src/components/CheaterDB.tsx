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

  return (
    <div className="min-h-screen bg-[#050a11] text-[#c9d4e0] font-sans flex flex-col">
      <div className="bg-[#050a11] border-b border-[#1e2530] py-12 sm:py-16 px-4 sm:px-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Public Cheater Database</h1>
        <p className="text-sm text-[#8a9ab0] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          A clinical, transparent record of verified cheating incidents across competitive programming platforms.
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <input 
            type="text" 
            placeholder="Search by CF handle or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0b121d] border border-[#2e3d50] rounded-lg py-3 px-12 text-sm outline-none focus:border-[#a5c9ff] transition-all"
          />
          <span className="absolute left-4 top-4"><SearchIcon /></span>
        </div>
      </div>

      <main className="px-4 sm:px-8 pt-8 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-[#55667a] uppercase tracking-widest">
            Verified Records ({total})
          </h3>
        </div>

        <div className="bg-[#0b121d] border border-[#1e2530] rounded-lg overflow-hidden shadow-2xl overflow-x-auto -webkit-overflow-scrolling-touch">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-[#080f19] border-b border-[#1e2530]">
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase">Handle</th>
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase">Contest</th>
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase">Prob</th>
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase">Reason</th>
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase">Status</th>
                <th className="px-6 py-4 text-[11px] text-[#55667a] uppercase text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2530]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#55667a]">Updating records...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[#55667a]">No verified records found matching your search.</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-[#0d1520] transition-colors">
                    <td className="px-6 py-4 font-mono text-[#a5c9ff] text-sm">{report.suspectHandle}</td>
                    <td className="px-6 py-4 text-sm text-[#fff] font-medium">{report.contestId}</td>
                    <td className="px-6 py-4 text-sm text-[#8a9ab0]">{report.problemId}</td>
                    <td className="px-6 py-4 text-sm text-[#8a9ab0]">{report.reason}</td>
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
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="text-[#55667a] hover:text-[#a5c9ff] transition-colors"
                      >
                        <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Details Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-[#0b121d] border border-[#1e2530] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-[#1e2530] flex justify-between items-center bg-[#0d131f]">
                <h2 className="text-lg font-bold text-white">Record Verification</h2>
                <button onClick={() => setSelectedReport(null)} className="text-[#55667a] hover:text-white text-xl">×</button>
              </div>
              <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#55667a] font-bold mb-1">Suspect</p>
                    <p className="text-[#a5c9ff] font-mono text-lg">{selectedReport.suspectHandle}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#55667a] font-bold mb-1">Context</p>
                    <p className="text-white">{selectedReport.contestId} / {selectedReport.problemId}</p>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest text-[#55667a] font-bold mb-2">Evidence & Rationale</p>
                  <div className="bg-[#050a11] border border-[#1e2530] p-4 rounded text-sm text-[#8a9ab0] leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedReport.description}
                  </div>
                </div>
                {selectedReport.evidenceImage && (
                  <div className="mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-[#55667a] font-bold mb-2">Attachment</p>
                    <img 
                      src={selectedReport.evidenceImage.startsWith('http')
                        ? selectedReport.evidenceImage
                        : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${selectedReport.evidenceImage}`}
                      alt="Evidence" 
                      className="w-full rounded border border-[#334155] shadow-inner"
                    />
                  </div>
                )}
                <div className="mt-8 pt-6 border-t border-[#1e2530] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#55667a] font-bold">Report ID</p>
                    <p className="text-xs font-mono text-[#55667a]">{selectedReport.reportId}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="w-full sm:w-auto px-6 py-2 bg-[#1e293b] text-white text-sm rounded hover:bg-[#2d3a4f] transition-colors"
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
