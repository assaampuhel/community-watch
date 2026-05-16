import { useState, useEffect } from "react";
import { getReports, type ReportData } from "../api";

export default function CheaterDB() {
  const [search, setSearch] = useState("");
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchCheaters() {
      setLoading(true);
      try {
        const data = await getReports({ status: 'reviewed', search });
        setReports(data.reports);
        setTotal(data.total);
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
      <div className="bg-[#050a11] border-b border-[#1e2530] py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-[#a5c9ff] mb-4">Public Cheater Database</h1>
        <p className="text-[#8a9ab0] max-w-2xl mx-auto mb-8">
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
          <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
        </div>
      </div>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-[#55667a] uppercase tracking-widest">
            Verified Records ({total})
          </h3>
        </div>

        <div className="bg-[#0b121d] border border-[#1e2530] rounded-lg overflow-hidden shadow-2xl">
          <table className="w-full text-left">
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
                        report.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#55667a] hover:text-[#a5c9ff] transition-colors">
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
      </main>
    </div>
  );
}
