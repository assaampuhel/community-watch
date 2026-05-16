import Authform from "./components/Authform";
import HomePage from "./components/HomePage";
import ActiveReports from "./components/ActiveReports";
import CheaterDB from "./components/CheaterDB";
import Navbar from "./components/Navbar";
import Report from "./components/Report";
import { AuthProvider } from "./context/AuthContext";
import { useState, useEffect } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// Layout component to share the Navbar across all main pages
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/reports",
        element: <ActiveReports />,
      },
      {
        path: "/cheaters",
        element: <CheaterDB />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/auth",
        element: <Authform />,
      },
    ]
  },
]);



function Preloader() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050a11',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{ position: 'relative', width: '100px', height: '100px', marginBottom: '24px' }}>
        {/* The Rolling Circle */}
        <div style={{
          position: 'absolute',
          inset: 0,
          border: "4px solid rgba(59, 130, 246, 0.1)",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}></div>
        {/* The Logo */}
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px', 
            height: '60px', 
            borderRadius: '12px' 
          }} 
        />
      </div>
      <h1 style={{ color: '#a5c9ff', fontSize: '18px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
        Initializing
      </h1>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(() => {
    // Check if we already showed the loader in this session
    return !sessionStorage.getItem('cw_loaded');
  });

  useEffect(() => {
    if (!loading) return;

    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('cw_loaded', 'true');
      }, 1200);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      const fallback = setTimeout(handleLoad, 4000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallback);
      };
    }
  }, [loading]);

  return (
    <AuthProvider>
      {loading && <Preloader />}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;