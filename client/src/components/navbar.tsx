import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isLoggedIn, user, logout, isModerator } = useAuth();

  return (
    <nav className="flex items-center justify-between px-8 h-16 border-b border-[#1e2530] bg-[#050a11] sticky top-0 z-50 font-sans">
      <div className="flex items-center gap-10">
        <NavLink to="/">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-md overflow-hidden">
              <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
            </div>
            <span className="text-[18px] font-bold text-[#a5c9ff]">CF Community Watch</span>
          </div>
        </NavLink>

        <div className="hidden sm:flex gap-8 items-center">
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

      <div className="flex items-center gap-5">
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
    </nav>
  );
}

export default Navbar;
