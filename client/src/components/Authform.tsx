import { useState } from 'react';
type UserData = {
  handle: string;
  rating: number;
  rank: string;
};
export default function AuthForm() {
  const [activeTab, setActiveTab] = useState('signin');
  const [handle, setHandle] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [canModerate, setCanModerate] = useState<boolean>(false); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const verifyHandle = async () => {
      try {
        setError("");
        setIsEligible(null)
  
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${handle}`
        );
  
        const data = await response.json();
        if (data.status !== "OK") {
          setError("User not found");
          setUserData(null);
          setCanModerate(false);
          return;
        }
        setUserData(data.result[0]);
        if(data.result[0].rating < 1500 || data.result[0].rating === undefined) {
         setIsEligible(false);
         setCanModerate(false);
        }
        else {
         setIsEligible(true);
         setCanModerate(true);
         console.log("User Tagged: MODERATOR_ELIBIGLE");
        }
      } catch (err) {
        setError("Something went wrong");
      }
    };
  
  return (
    <div className="bg-[#1a202c] border border-[#334155] w-full max-w-md rounded-lg p-8 shadow-2xl">
      
      <div className="flex w-full mb-8 rounded overflow-hidden shadow-sm">
        <button onClick={() => setActiveTab('signin')} className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors duration-200 ${activeTab === 'signin' ? 'bg-[#4894e2] text-[#002b4e]' : 'bg-[#2f3542] text-gray-400 hover:text-white'}`}>
          Sign In
        </button>
        
        <button onClick={() => setActiveTab('signup')} className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors duration-200 ${activeTab === 'signup' ? 'bg-[#4894e2] text-[#002b4e]' : 'bg-[#2f3542] text-gray-400 hover:text-white'}`}>
          Sign Up
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-mono text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            placeholder="moderator@example.com"
            className="w-full bg-white text-black rounded px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#9fcaff] transition-shadow"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Password</label>
            <a href="#" className="text-xs font-mono text-[#9fcaff] hover:underline">Forgot Password?</a>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-white text-black rounded px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#9fcaff] transition-shadow"
          />
        </div>

        {activeTab === 'signup' && (
          <div className="mt-4 pt-5 border-t border-[#334155]">
            <label className="block text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider border-l-2 border-[#334155] pl-2">
            Codeforces Handle
            </label>
            <input 
              type="text" 
              placeholder="tourist"
              className="w-full bg-[#2f3542] border border-[#414751] text-white rounded px-3 py-2.5 text-sm outline-none focus:border-[#9fcaff] transition-colors"
              value={handle} 
              onChange={(e) => setHandle(e.target.value)} 
            />
          </div>
        )}
      </div>

      {activeTab === 'signup' && (
        <div className="mt-6 border border-orange-500/20 bg-orange-500/5 rounded p-4 flex gap-3 items-start">
          <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-gray-400 leading-relaxed">
            Moderation privileges (flagging/reviewing) require a verified Codeforces rating of <strong className="text-orange-500 font-mono">1500+</strong>.
          </p>
        </div>
      )}
      {activeTab === 'signin' ? 
      (
      <button className="w-full bg-[#0061a5] hover:bg-[#4894e2] text-white py-3 rounded mt-6 font-medium text-sm transition-colors flex justify-center items-center gap-2">
        'Authenticate'
      </button>
      ) :
      (
      <button onClick={verifyHandle} className="w-full bg-[#0061a5] hover:bg-[#4894e2] text-white py-3 rounded mt-6 font-medium text-sm transition-colors flex justify-center items-center gap-2">
        'Register'
      </button>
      )}
      {isEligible === true && (
        <p className="text-green-500 mt-2">Congratulations! You are eligible for moderation privileges.</p>
      )}
      {isEligible === false && (
        <p className="text-orange-500 mt-2">You will not be able to moderate requests as your rating is below 1500.</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}