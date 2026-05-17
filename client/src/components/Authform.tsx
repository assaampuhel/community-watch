import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiLogin, apiSignupChallenge, apiSignupVerify } from '../api';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

export default function Authform() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [activeTab, setActiveTab] = useState('signin');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successUser, setSuccessUser] = useState<string | null>(null);

  // Challenge step states
  const [signupStep, setSignupStep] = useState(1);
  const [challengeToken, setChallengeToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'signin') {
      setActiveTab(mode);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'signin') {
        const response = await apiLogin(handle, password);
        login(response.token, response.user);
        setSuccessUser(response.user.handle);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Step 1: Request Challenge Token
        const response = await apiSignupChallenge(handle, email, password);
        setChallengeToken(response.token);
        setSignupStep(2);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleVerifyOwnership = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await apiSignupVerify(handle);
      login(response.token, response.user);
      setSuccessUser(response.user.handle);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your Codeforces settings.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background text-text-main flex flex-col transition-colors duration-300">
      <div className="flex-1 flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 border border-surface-border rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
          <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-primary">CF Community Watch</h1>
        <p className="text-xs text-text-label font-mono tracking-widest uppercase mt-2">
          Clinical & Objective Moderation
        </p>
      </div>

      <div className="bg-surface border border-surface-border w-full max-w-md rounded-lg p-6 sm:p-8 shadow-2xl relative transition-colors duration-300">
        
        {!(activeTab === 'signup' && signupStep === 2) && (
          <div className="flex w-full mb-8 rounded overflow-hidden bg-surface-dim">
            <button 
              type="button"
              onClick={() => { setActiveTab('signin'); setError(''); }} 
              className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer border-none ${activeTab === 'signin' ? 'bg-primary text-white' : 'text-text-label hover:text-text-main'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('signup'); setError(''); }} 
              className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer border-none ${activeTab === 'signup' ? 'bg-primary text-white' : 'text-text-label hover:text-text-main'}`}
            >
              Sign Up
            </button>
          </div>
        )}

        {!(activeTab === 'signup' && signupStep === 2) && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-text-label mb-1.5 uppercase tracking-wider">Codeforces Handle</label>
              <input 
                type="text" 
                required
                placeholder="e.g. tourist"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-surface-dim border border-surface-border text-text-main rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            
            {activeTab === 'signup' && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                <label className="block text-xs font-mono text-text-label mb-1.5 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. mike@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-dim border border-surface-border text-text-main rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-text-label mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-dim border border-surface-border text-text-main rounded px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-label hover:text-text-main transition-colors cursor-pointer bg-transparent border-none"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.057 10.057 0 012.183-3.64m4.364-4.52A10.041 10.041 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.057 10.057 0 01-2.183 3.64M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-mono text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 disabled:opacity-50 text-white py-3 rounded mt-2 font-medium text-sm transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer border-none"
            >
              {loading ? 'Processing...' : (activeTab === 'signin' ? 'Authenticate' : 'Verify Handle & Signup')}
              {!loading && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={activeTab === 'signin' ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M14 5l7 7m0 0l-7 7m7-7H3"} />
                </svg>
              )}
            </button>
          </form>
        )}

        {activeTab === 'signup' && signupStep === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full tracking-widest font-bold">
                Step 2 of 2: Ownership Proof
              </span>
            </div>

            <h3 className="text-md font-bold text-text-main mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verify Codeforces Account
            </h3>
            
            <p className="text-xs text-text-muted mb-5 leading-relaxed font-sans">
              To verify that the Codeforces account <strong className="text-primary font-mono">{handle}</strong> belongs to you, follow these brief instructions:
            </p>

            <div className="space-y-4 text-xs leading-relaxed mb-6 font-sans">
              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-surface-dim border border-surface-border flex items-center justify-center text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-text-main font-semibold mb-1">Copy Your Verification Token</p>
                  <div className="flex items-center gap-2 mt-1.5 bg-surface-dim border border-surface-border rounded p-2.5">
                    <span className="font-mono text-sm text-text-main font-bold tracking-wider select-all">{challengeToken}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(challengeToken);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="ml-auto text-[10px] uppercase font-bold text-primary hover:text-text-main transition-colors cursor-pointer bg-transparent border-none"
                    >
                      {copied ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-surface-dim border border-surface-border flex items-center justify-center text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-text-main font-semibold">Paste Into Codeforces Organization</p>
                  <p className="text-text-muted mt-1">
                    Open your Codeforces profile settings and paste the copied token directly inside the <strong className="text-text-main">Organization</strong> field.
                  </p>
                  <a
                    href="https://codeforces.com/settings/social"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-text-main font-semibold transition-colors mt-2 underline"
                  >
                    Go to Codeforces Settings
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded-full bg-surface-dim border border-surface-border flex items-center justify-center text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-text-main font-semibold">Save Changes & Verify</p>
                  <p className="text-text-muted mt-1">
                    Save your Codeforces profile changes so they become public, then return here and click the verification button below! <strong className="text-primary font-mono">(It might take a few seconds to register the changes)</strong>
                  </p>
                  <p className="text-[10px] text-orange-400 font-mono mt-1 leading-normal">
                    ⚠️ Note: You can safely remove this token from your Codeforces profile once the verification succeeds!
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-mono text-center bg-red-500/10 py-2.5 px-3 rounded border border-red-500/20 mb-4 leading-normal">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <button 
                type="button" 
                disabled={loading}
                onClick={handleVerifyOwnership}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded font-bold text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/15 border-none"
              >
                {loading ? 'Verifying profile...' : 'Verify Account Ownership'}
              </button>

              <button 
                type="button" 
                disabled={loading}
                onClick={() => {
                  setSignupStep(1);
                  setError('');
                }}
                className="w-full bg-surface-dim hover:bg-surface text-text-main text-xs font-semibold py-2.5 rounded border border-surface-border transition-colors cursor-pointer"
              >
                Change Handle / Edit Credentials
              </button>
            </div>
          </div>
        )}

        {activeTab === 'signup' && signupStep === 1 && (
          <div className="mt-6 border border-orange-500/20 bg-orange-500/5 rounded-lg p-4 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-text-muted leading-relaxed">
              Moderation privileges (reviewing reports) require a verified Codeforces rating of <strong className="text-orange-500 font-mono">1500+</strong>.
            </p>
          </div>
        )}
      </div>

      {successUser && (
        <>
          <style>{`
            @keyframes radar-scan {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes shield-bounce {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.1); }
              70% { transform: scale(0.95); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes text-pulse {
              0%, 100% { opacity: 0.6; }
              50% { opacity: 1; }
            }
            .radar-ring {
              animation: radar-scan 4s linear infinite;
            }
            .shield-icon {
              animation: shield-bounce 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .pulse-text {
              animation: text-pulse 1.5s ease-in-out infinite;
            }
          `}</style>
          <div className="fixed inset-0 bg-background/95 z-[9999] backdrop-blur-xl flex flex-col items-center justify-center p-4 transition-colors duration-300">
            {/* Concentric Rotating Radar Rings */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              {/* Outer Ring */}
              <div className="absolute inset-0 border border-primary/20 rounded-full radar-ring"></div>
              {/* Middle Scanning Arc */}
              <div className="absolute inset-2 border-t-2 border-r-2 border-primary/60 border-l border-b border-transparent rounded-full radar-ring"></div>
              {/* Inner Glowing Core */}
              <div className="absolute inset-8 bg-primary/5 rounded-full border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
                <svg className="w-10 h-10 text-primary shield-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            {/* Futuristic Terminal Text */}
            <div className="text-center font-mono max-w-sm">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-[0.25em] mb-2 pulse-text">
                [ ACCESS GRANTED ]
              </p>
              <h2 className="text-2xl font-bold text-text-main mb-3">
                Welcome back, {successUser}
              </h2>
              <div className="text-xs text-text-label flex flex-col gap-1 border-t border-surface-border/50 pt-3">
                <p className="pulse-text">🔐 Cryptographic handshake: SECURE</p>
                <p className="delay-100">📡 Synapse Link: Synchronized</p>
                <p className="text-primary mt-2 animate-pulse">Customizing your experience...</p>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
      <Footer />
    </div>
  );
}