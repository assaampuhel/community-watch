import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout, isModerator } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="border-b border-[#1e2530] bg-[#050a11] sticky top-0 z-50 font-sans">
      <div className="flex items-center justify-between px-4 sm:px-8 h-16 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-10">
          <NavLink to="/" onClick={closeMenu}>
            <div className="flex items-center gap-2.5">
              <div className="w-[30px] h-[30px] rounded-md overflow-hidden">
                <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
              </div>
              <span className="text-[18px] font-bold text-[#a5c9ff]">CF Community Watch</span>
            </div>
          </NavLink>

          <div className="hidden md:flex gap-8 items-center">
            <NavLink to="/reports" className={({ isActive }) =>
              `h-16 flex items-center px-1 no-underline transition-colors ${isActive ? "text-white border-b-2 border-blue-500" : "text-[#8a9ab0] hover:text-white"}`
            }>Reports</NavLink>
            <NavLink to="/cheaters" className={({ isActive }) =>
              `h-16 flex items-center px-1 no-underline transition-colors ${isActive ? "text-white border-b-2 border-blue-500" : "text-[#8a9ab0] hover:text-white"}`
            }>Cheater DB</NavLink>
            <NavLink to="/report" className={({ isActive }) =>
              `h-16 flex items-center px-1 no-underline transition-colors ${isActive ? "text-white border-b-2 border-blue-500" : "text-[#8a9ab0] hover:text-white"}`
            }>New Report</NavLink>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-[#a5c9ff]">{user?.handle}</span>
                {isModerator && <span className="text-[10px] text-orange-400 font-mono uppercase tracking-tighter">Moderator</span>}
              </div>
              <button 
                onClick={() => setShowConfirmLogout(true)}
                className="text-xs font-bold text-[#ffb4ab] border border-[#ffb4ab]/30 px-3 py-1.5 rounded hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/auth?mode=signin">
                <button className="text-[14px] text-[#c9d4e0] hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                  Sign In
                </button>
              </NavLink>
              <NavLink to="/auth?mode=signup">
                <button className="text-[14px] font-bold text-black bg-[#a5c9ff] px-4 py-2 rounded hover:bg-[#8ab6f8] transition-colors cursor-pointer border-none">
                  Sign Up
                </button>
              </NavLink>
            </>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="flex md:hidden items-center">
          <button
            onClick={toggleMenu}
            className="text-[#8a9ab0] hover:text-white focus:outline-none p-1.5 relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 group cursor-pointer"
            aria-label="Toggle Menu"
          >
            {/* Top Line */}
            <span className={`w-5 h-[2px] bg-[#8a9ab0] group-hover:bg-white rounded transition-all duration-300 ease-in-out transform ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`} />
            {/* Middle Line */}
            <span className={`w-5 h-[2px] bg-[#8a9ab0] group-hover:bg-white rounded transition-all duration-300 ease-in-out ${
              isOpen ? "opacity-0" : ""
            }`} />
            {/* Bottom Line */}
            <span className={`w-5 h-[2px] bg-[#8a9ab0] group-hover:bg-white rounded transition-all duration-300 ease-in-out transform ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`} />
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu with Smooth Transition */}
      <div className={`md:hidden absolute top-16 left-0 right-0 border-b border-[#1e2530] bg-[#050a11] px-4 py-6 space-y-4 shadow-2xl z-50 transition-all duration-300 ease-out origin-top transform ${
        isOpen 
          ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto" 
          : "opacity-0 -translate-y-4 scale-y-95 pointer-events-none"
      }`}>
        <div className="flex flex-col space-y-3">
          <NavLink 
            to="/reports" 
            onClick={closeMenu}
            className={({ isActive }) => 
              `py-2 text-[15px] font-medium no-underline transition-colors ${isActive ? "text-[#a5c9ff]" : "text-[#8a9ab0]"}`
            }
          >
            Reports
          </NavLink>
          <NavLink 
            to="/cheaters" 
            onClick={closeMenu}
            className={({ isActive }) => 
              `py-2 text-[15px] font-medium no-underline transition-colors ${isActive ? "text-[#a5c9ff]" : "text-[#8a9ab0]"}`
            }
          >
            Cheater DB
          </NavLink>
          <NavLink 
            to="/report" 
            onClick={closeMenu}
            className={({ isActive }) => 
              `py-2 text-[15px] font-medium no-underline transition-colors ${isActive ? "text-[#a5c9ff]" : "text-[#8a9ab0]"}`
            }
          >
            New Report
          </NavLink>
        </div>

        <div className="border-t border-[#1e2530] pt-4 flex flex-col space-y-3">
          {isLoggedIn ? (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold text-[#a5c9ff]">{user?.handle}</span>
                  {isModerator && <span className="text-[10px] text-orange-400 font-mono uppercase tracking-tighter mt-0.5">Moderator</span>}
                </div>
                <button 
                  onClick={() => { setShowConfirmLogout(true); closeMenu(); }}
                  className="text-xs font-bold text-[#ffb4ab] border border-[#ffb4ab]/30 px-3 py-1.5 rounded hover:bg-[#ffb4ab]/10 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 w-full">
              <NavLink to="/auth?mode=signin" onClick={closeMenu} className="flex-1">
                <button className="w-full text-[14px] text-[#c9d4e0] hover:text-white py-2 rounded border border-[#1e2530] hover:bg-[#151b25] transition-colors cursor-pointer bg-transparent">
                  Sign In
                </button>
              </NavLink>
              <NavLink to="/auth?mode=signup" onClick={closeMenu} className="flex-1">
                <button className="w-full text-[14px] font-bold text-black bg-[#a5c9ff] py-2 rounded hover:bg-[#8ab6f8] transition-colors cursor-pointer border-none">
                  Sign Up
                </button>
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {showConfirmLogout && (
        <>
          <style>{`
            @keyframes fade-in {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
            @keyframes scale-up {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .anim-fade-in {
              animation: fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .anim-scale-up {
              animation: scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm anim-fade-in">
            <div className="bg-[#0b121d] border border-[#1e2530] rounded-xl w-full max-w-md overflow-hidden shadow-2xl p-6 sm:p-8 anim-scale-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Confirm Sign Out</h3>
                  <p className="text-xs font-mono text-[#55667a] uppercase tracking-wider">Session Termination</p>
                </div>
              </div>
              
              <p className="text-sm text-[#8a9ab0] mb-6 leading-relaxed font-sans">
                Are you sure you want to sign out of CF Community Watch? You will need to re-authenticate with your Codeforces handle to participate in report moderation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#1e293b] text-white text-xs font-semibold rounded hover:bg-[#2d3a4f] transition-all cursor-pointer border border-[#334155]/30"
                >
                  Stay Back
                </button>
                <button
                  onClick={() => {
                    setShowConfirmLogout(false);
                    logout();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#7f1d1d] text-[#fca5a5] text-xs font-semibold rounded hover:bg-[#991b1b] transition-all cursor-pointer border border-red-900/30"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
