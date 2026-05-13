import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 h-16 border-b border-[#1e2530] bg-[#050a11] sticky top-0 z-50 font-sans">
      <div className="flex items-center gap-10">
        {/* Logo & Title */}
         <NavLink to="/"><div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-md overflow-hidden">
           <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
          </div>
          <span className="text-[18px] font-bold text-[#a5c9ff]">CF Community Watch</span>
        </div>
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden sm:flex gap-8 items-center">
          <NavLink to="/reports" className="text-[14px] text-[#8a9ab0] hover:text-white transition-colors no-underline">Reports</NavLink>
          <NavLink to="/cheaters" className="text-[14px] text-white no-underline border-b-2 border-[#a5c9ff] pb-[20px] translate-y-[11px]">Cheater DB</NavLink>
        </div>
      </div>

      {/* Navbar Auth Buttons */}
        <div className="flex items-center gap-5">
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
        </div>
    </nav>
  );
}

export default Navbar;
