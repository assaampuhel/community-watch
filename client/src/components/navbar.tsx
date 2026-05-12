function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0d131f] sticky top-0 z-50 font-sans text-white">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#1a202c] border border-[#334155] rounded flex items-center justify-center">
            <span className="text-[#9fcaff] font-mono text-[10px]">CF</span>
        </div>
        <span className="font-bold text-lg tracking-wide">CF Community Watch</span>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex gap-6 items-center">
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Reports</button>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Cheater DB</button>
        <button className="text-sm font-medium text-white border-b-2 border-[#9fcaff] pb-1">New Report</button>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex gap-4 items-center">
        <button className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</button>
        <button className="text-sm bg-[#e2e8f0] text-[#0d131f] px-4 py-1.5 rounded font-medium hover:bg-white transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
