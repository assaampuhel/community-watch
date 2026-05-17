import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createReport } from "../api";
import Footer from "./Footer";

export default function Report() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [suspectHandle, setSuspectHandle] = useState("");
  const [contestId, setContestId] = useState("");
  const [problemId, setProblemId] = useState("");
  const [reason, setReason] = useState("Code Similarity");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const handleReset = () => {
    setSuspectHandle("");
    setContestId("");
    setProblemId("");
    setReason("Code Similarity");
    setDescription("");
    setError("");
    setFile(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthPrompt(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Verify suspect handle exists on Codeforces
      const userRes = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(suspectHandle.trim())}`);
      const userData = await userRes.json();
      if (userData.status === "FAILED") {
        throw new Error(`Codeforces handle "${suspectHandle}" does not exist.`);
      }

      // 2. Verify contest exists on Codeforces (using anonymous standings query with no extra parameters to comply with CF API limits)
      const standingsRes = await fetch(`https://codeforces.com/api/contest.standings?contestId=${encodeURIComponent(contestId.trim())}`);
      const standingsData = await standingsRes.json();
      
      if (standingsData.status === "FAILED") {
        if (standingsData.comment && standingsData.comment.includes("not found")) {
          throw new Error(`Contest ID "${contestId}" does not exist on Codeforces.`);
        } else {
          throw new Error(standingsData.comment || `Failed to verify Contest ID "${contestId}".`);
        }
      }

      // 3. Verify problem ID exists in this contest (case-insensitively)
      const problems = standingsData.result.problems || [];
      const problemExists = problems.some(
        (prob: any) => prob.index.toLowerCase() === problemId.trim().toLowerCase()
      );
      
      if (!problemExists) {
        const validIndexes = problems.map((prob: any) => prob.index).join(", ");
        throw new Error(
          `Problem "${problemId}" does not exist in Contest ${contestId}. Valid problem IDs are: ${validIndexes}`
        );
      }

      // 4. Verify suspect participated (made submissions) in that specific contest
      const statusRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(suspectHandle.trim())}`);
      const statusData = await statusRes.json();
      if (statusData.status === "FAILED") {
        throw new Error(statusData.comment || `Failed to fetch submissions for user "${suspectHandle}".`);
      }

      const submissions = statusData.result || [];
      const hasSubmitted = submissions.some((sub: any) => sub.contestId === Number(contestId.trim()));
      
      if (!hasSubmitted) {
        throw new Error(`User "${suspectHandle}" did not submit any solutions in Contest ${contestId}.`);
      }

      const formData = new FormData();
      formData.append('reportId', `REP-${Date.now()}`);
      formData.append('reporterHandle', user?.handle || "anonymous");
      formData.append('suspectHandle', suspectHandle);
      formData.append('contestId', contestId);
      formData.append('problemId', problemId);
      formData.append('reason', reason);
      formData.append('description', description);
      
      if (file) {
        formData.append('evidenceImage', file);
      }

      await createReport(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-64px)]">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#050a11] text-white">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
          <p className="text-gray-400 text-center max-w-md px-6">
            Thank you for helping maintain community integrity. Your report has been logged and is awaiting peer review.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-[#1e293b] border border-[#334155] rounded text-sm hover:bg-[#334155] transition-colors text-white font-medium"
            >
              Return to Home
            </button>
            <button 
              onClick={handleReset}
              className="px-6 py-2.5 bg-blue-600 border border-blue-500 rounded text-sm hover:bg-blue-500 transition-colors text-white font-medium shadow-lg"
            >
              Submit New Report
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#050a11] text-white font-sans flex flex-col min-h-[calc(100vh-64px)]">
      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl mx-auto px-6 pt-10 pb-12">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Report Misconduct</h1>
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            Submit objective evidence of competitive programming rules violations for peer review. All reports are logged and subject to moderator audit.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: The Main Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {showAuthPrompt && (
              <div className="bg-[#1e293b] border-2 border-[#3b82f6] rounded-lg p-6 mb-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-full flex items-center justify-center text-[#3b82f6]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Authentication Required</h3>
                    <p className="text-gray-400 text-sm">You must have a verified account to submit reports to the community database.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate("/auth?mode=signup")}
                    className="flex-1 bg-[#3b82f6] hover:bg-blue-400 text-white font-bold py-2.5 rounded transition-colors"
                  >
                    Create Account
                  </button>
                  <button 
                    onClick={() => navigate("/auth?mode=signin")}
                    className="flex-1 bg-transparent border border-[#334155] hover:bg-[#334155] text-white font-bold py-2.5 rounded transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[#1a202c] border border-[#334155] rounded-lg p-6 shadow-xl">
              
              {/* Suspect Handle Input */}
              <div className="mb-6">
                <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Suspect Codeforces Handle <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 focus-within:border-[#9fcaff] transition-colors">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    required
                    value={suspectHandle}
                    onChange={(e) => setSuspectHandle(e.target.value)}
                    placeholder="e.g. tourist" 
                    className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-600" 
                  />
                </div>
              </div>

              {/* Contest & Problem IDs */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                    Contest ID <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={contestId}
                    onChange={(e) => setContestId(e.target.value)}
                    placeholder="e.g. 1920" 
                    className="w-full bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 text-sm text-white outline-none focus:border-[#9fcaff] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                    Problem ID <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={problemId}
                    onChange={(e) => setProblemId(e.target.value)}
                    placeholder="e.g. C" 
                    className="w-full bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 text-sm text-white outline-none focus:border-[#9fcaff] transition-colors"
                  />
                </div>
              </div>

              {/* Primary Reason Select */}
              <div className="mb-6">
                <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Primary Reason <span className="text-red-500">*</span>
                </label>
                <select 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-[#9fcaff] transition-colors"
                >
                  <option value="Code Similarity">Code Similarity (Plagiarism)</option>
                  <option value="Outside Assistance">Outside Assistance</option>
                  <option value="Multiple Accounts">Multiple Accounts</option>
                  <option value="Other">Other Violation</option>
                </select>
              </div>

              {/* Rich Text Editor Mockup */}
              <div className="mb-6">
                <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Evidence / Rationale <span className="text-red-500">*</span>
                </label>
                
                <div className="bg-[#0d131f] border border-[#334155] rounded-md overflow-hidden focus-within:border-[#9fcaff] transition-colors">
                  {/* Fake Toolbar */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-[#334155] bg-[#161c27]">
                    <button type="button" className="text-gray-400 hover:text-white font-bold font-serif text-sm">B</button>
                    <button type="button" className="text-gray-400 hover:text-white italic font-serif text-sm">I</button>
                    <div className="w-px h-4 bg-[#334155]"></div>
                    <button type="button" className="text-gray-400 hover:text-white">🔗</button>
                    <button type="button" className="text-gray-400 hover:text-white font-mono text-xs">&lt; &gt;</button>
                  </div>
                  
                  <textarea 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide detailed evidence, including contest links, problem IDs, and specific code snippets demonstrating similarities..."
                    className="w-full h-48 bg-transparent text-gray-300 text-sm p-4 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Image Upload / Attachments */}
              <div className="mb-6 mt-6">
                <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Attachments (Screenshots / Evidence)
                </label>
                <div className="relative border-2 border-dashed border-[#334155] rounded-md p-8 text-center hover:border-[#9fcaff] hover:bg-[#161c27] transition-all cursor-pointer bg-[#0d131f] group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/png, image/jpeg, image/gif" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-3 group-hover:text-[#9fcaff] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-300 font-medium mb-1 group-hover:text-[#9fcaff] transition-colors">
                    {file ? file.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#334155]">
                <button 
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded text-sm font-medium text-gray-300 hover:text-white border border-[#334155] hover:bg-[#334155]/50 transition-colors text-center justify-center flex">
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded text-sm font-medium bg-[#9fcaff] text-[#003259] hover:bg-[#d2e4ff] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#9fcaff]/20"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Submit Report for Peer Review
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: Reporting Guidelines */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a202c]/50 border border-[#334155] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#9fcaff] mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reporting Guidelines
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <span className="text-[#ffb86e]">🔗</span> Provide Direct Links
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    Always include direct URLs to the contest, the specific problem, and the submitted code.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <span className="text-[#ffb86e]">📄</span> Highlight Similarities
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    Use code blocks to highlight exact functional similarities or variable renaming patterns.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#ffb4ab] mb-1 flex items-center gap-2">
                    <span>⚠️</span> Objective Data Only
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed pl-6">
                    Avoid emotional language or personal attacks. Reports are judged solely on clinical code evidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}