import Navbar from "./navbar";

export default function Report() {

  return (
    
    <div className="bg-[#0d131f] text-white font-sans pb-12 min-h-[calc(100vh-73px)]">
      <Navbar />
      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 pt-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Report Misconduct</h1>
          <p className="text-gray-400 text-sm max-w-3xl leading-relaxed">
            Submit objective evidence of competitive programming rules violations for peer review. All reports are logged and subject to moderator audit.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: The Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1a202c] border border-[#334155] rounded-lg p-6 shadow-xl">
              
              {/* Top Inputs: Reporter & Suspect */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                    Your Codeforces Handle <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 focus-within:border-[#9fcaff] transition-colors">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="e.g. your_handle" 
                      className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-600" 
                    />
                  </div>
                </div>

                {/* Suspect Handle Input */}
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                    Suspect Codeforces Handle <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center bg-[#0d131f] border border-[#334155] rounded px-3 py-2.5 focus-within:border-[#9fcaff] transition-colors">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="e.g. tourist" 
                      className="bg-transparent text-white text-sm w-full outline-none placeholder-gray-600" 
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Editor Mockup */}
              <div className="mb-6">
                <label className="block text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider">
                  Evidence / Rationale <span className="text-red-500">*</span>
                </label>
                
                <div className="bg-[#0d131f] border border-[#334155] rounded-md overflow-hidden focus-within:border-[#9fcaff] transition-colors">
                  {/* Fake Toolbar */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-[#334155] bg-[#161c27]">
                    <button className="text-gray-400 hover:text-white font-bold font-serif text-sm">B</button>
                    <button className="text-gray-400 hover:text-white italic font-serif text-sm">I</button>
                    <div className="w-px h-4 bg-[#334155]"></div>
                    <button className="text-gray-400 hover:text-white">🔗</button>
                    <button className="text-gray-400 hover:text-white font-mono text-xs">&lt; &gt;</button>
                  </div>
                  
                  <textarea 
                    placeholder="Provide detailed evidence, including contest links, problem IDs, and specific code snippets demonstrating similarities..."
                    className="w-full h-48 bg-transparent text-gray-300 text-sm p-4 outline-none resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-[#334155]">
                <button className="px-6 py-2 rounded text-sm font-medium text-gray-300 hover:text-white border border-[#334155] hover:bg-[#334155]/50 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2 rounded text-sm font-medium bg-[#9fcaff] text-[#003259] hover:bg-[#d2e4ff] transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Submit Report for Peer Review
                </button>
              </div>

            </div>
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