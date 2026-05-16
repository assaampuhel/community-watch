import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiLogin, apiRegister } from '../api';
import { useAuth } from '../context/AuthContext';

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
      let response;
      if (activeTab === 'signin') {
        response = await apiLogin(handle, password);
      } else {
        response = await apiRegister(handle, email, password);
      }
      
      login(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050a11] text-[#c9d4e0] flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 border border-[#1e2530] rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
          <img src="/logo.png" alt="CF Community Watch" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-[#a5c9ff]">CF Community Watch</h1>
        <p className="text-xs text-[#55667a] font-mono tracking-widest uppercase mt-2">
          Clinical & Objective Moderation
        </p>
      </div>

      <div className="bg-[#0b121d] border border-[#1e2530] w-full max-w-md rounded-lg p-8 shadow-2xl relative">
        
        <div className="flex w-full mb-8 rounded overflow-hidden bg-[#151b25]">
          <button 
            onClick={() => { setActiveTab('signin'); setError(''); }} 
            className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors ${activeTab === 'signin' ? 'bg-[#3b82f6] text-white' : 'text-[#55667a] hover:text-white'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setActiveTab('signup'); setError(''); }} 
            className={`flex-1 py-2.5 text-xs font-bold font-mono tracking-wider uppercase transition-colors ${activeTab === 'signup' ? 'bg-[#3b82f6] text-white' : 'text-[#55667a] hover:text-white'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-[#55667a] mb-1.5 uppercase tracking-wider">Codeforces Handle</label>
            <input 
              type="text" 
              required
              placeholder="e.g. tourist"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-[#151b25] border border-[#1e2a38] text-white rounded px-3 py-2.5 text-sm outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>
          
          {activeTab === 'signup' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-300">
              <label className="block text-xs font-mono text-[#55667a] mb-1.5 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="e.g. mike@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151b25] border border-[#1e2a38] text-white rounded px-3 py-2.5 text-sm outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#55667a] mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151b25] border border-[#1e2a38] text-white rounded px-3 py-2.5 text-sm outline-none focus:border-[#3b82f6] transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
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
            className="w-full bg-[#3b82f6] hover:bg-blue-400 disabled:opacity-50 text-white py-3 rounded mt-2 font-medium text-sm transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Processing...' : (activeTab === 'signin' ? 'Authenticate' : 'Register Account')}
            {!loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={activeTab === 'signin' ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M14 5l7 7m0 0l-7 7m7-7H3"} />
              </svg>
            )}
          </button>
        </form>

        {activeTab === 'signup' && (
          <div className="mt-6 border border-orange-500/20 bg-orange-500/5 rounded-lg p-4 flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
            <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-[#8a9ab0] leading-relaxed">
              Moderation privileges (reviewing reports) require a verified Codeforces rating of <strong className="text-orange-500 font-mono">1500+</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}