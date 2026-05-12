import { useState } from 'react';
import { useVerifyHandle } from './useVerifyHandle';

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const {
    handle,
    setHandle,
    userData,
    error,
    isEligible,
    canModerate,
    verifyHandle
  } = useVerifyHandle();

  
  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col items-center justify-center p-6">

        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-surface border border-surface-border rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-primary">CF Community Watch</h1>
          <p className="text-xs text-text-muted font-mono tracking-widest uppercase mt-2">
            Clinical & Objective Moderation
          </p>
        </div>

        <div className="bg-surface border border-surface-border w-full max-w-md rounded-lg p-8 shadow-2xl relative">
        
        <div className="flex w-full mb-8 rounded overflow-hidden shadow-sm bg-surface-border/30">
            <button onClick={() => setActiveTab('signin')} className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors duration-200 ${activeTab === 'signin' ? 'bg-[#3b82f6] text-primary-on' : 'text-text-muted hover:text-text-main'}`}>
            Sign In
            </button>
            
            <button onClick={() => setActiveTab('signup')} className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors duration-200 ${activeTab === 'signup' ? 'bg-[#3b82f6] text-primary-on' : 'text-text-muted hover:text-text-main'}`}>
            Sign Up
            </button>
        </div>

        <div className="space-y-5">
            <div>
            <label className="block text-xs font-mono text-text-label mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
                type="email" 
                placeholder="moderator@example.com"
                className="w-full bg-white text-black rounded px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
            </div>

            <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-mono text-text-label uppercase tracking-wider">Password</label>
                {activeTab === 'signin' && (
                  <a href="#" className="text-xs font-mono text-primary hover:underline">Forgot Password?</a>
                )}
            </div>
            <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white text-black rounded px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
            </div>

            {activeTab === 'signup' && (
            <div className="mt-4 pt-5 border-t border-surface-border relative">
                <div className="absolute -left-6 top-7 text-surface-border">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-[10px] font-mono text-text-label mb-3 uppercase tracking-wider">SIGN UP FIELDS (MOCKUP)</div>
                <label className="block text-xs font-mono text-text-label mb-2 uppercase tracking-wider">
                Codeforces Handle
                </label>
                <input 
                type="text" 
                placeholder="tourist"
                className="w-full bg-surface-border/30 border border-surface-border text-text-main rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
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
            <p className="text-sm text-text-muted leading-relaxed">
                Moderation privileges (flagging/reviewing) require a verified Codeforces rating of <strong className="text-orange-500 font-mono">1500+</strong>.
            </p>
            </div>
        )}
        {activeTab === 'signin' ? 
        (
        <button className="w-full bg-[#3b82f6] hover:bg-blue-400 text-white py-3 rounded mt-6 font-medium text-sm transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20">
            Authenticate 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
        </button>
        ) :
        (
        <button onClick={verifyHandle} className="w-full bg-[#3b82f6] hover:bg-blue-400 text-white py-3 rounded mt-6 font-medium text-sm transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20">
            Register
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
        </button>
        )}
        {isEligible === true && (
            <p className="text-green-500 mt-2 text-sm text-center">Congratulations! You are eligible for moderation privileges.</p>
        )}
        {isEligible === false && (
            <p className="text-orange-500 mt-2 text-sm text-center">You will not be able to moderate requests as your rating is below 1500.</p>
        )}
        {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
        </div>

        <div className="mt-8 flex gap-6 text-xs text-text-label font-mono">
          <a href="#" className="flex items-center gap-1.5 hover:text-text-main transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Support
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-text-main transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Terms
          </a>
        </div>
    </div>
  );
}