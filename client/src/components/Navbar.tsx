import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout, isModerator } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
                onClick={logout}
                className="text-xs font-bold text-[#ffb4ab] border border-[#ffb4ab]/30 px-3 py-1.5 rounded hover:bg-[#ffb4ab]/10 transition-colors"
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
            className="text-[#8a9ab0] hover:text-white focus:outline-none p-1.5"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 border-b border-[#1e2530] bg-[#050a11] px-4 py-6 space-y-4 shadow-2xl z-50">
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
                    onClick={() => { logout(); closeMenu(); }}
                    className="text-xs font-bold text-[#ffb4ab] border border-[#ffb4ab]/30 px-3 py-1.5 rounded hover:bg-[#ffb4ab]/10 transition-colors"
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
      )}
    </nav>
  );
}

export default Navbar;
