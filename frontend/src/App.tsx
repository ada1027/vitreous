import { useEffect, useRef } from 'react';
import Dashboard from './Dashboard';
import GoogleConnections from './GoogleConnections';
import GithubConnections from './GithubConnections';
import AppDetail from './AppDetail';
import ConnectionUpdated from './ConnectionUpdated';
import DormantAppDetail from './DormantAppDetail';
import { useScan } from './context/ScanContext';

function App() {
  const { setScanData, googleToken, setGoogleToken, loading, setLoading } = useScan();
  const pathname = window.location.pathname;
  const scanCalledRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('google_token');

    // 1. Save token
    const localStr = localStorage.getItem('google_access_token');
    const validLocalToken = localStr && localStr !== 'null' ? localStr : null;
    const tokenToUse = urlToken || validLocalToken;

    if (urlToken) {
      localStorage.setItem('google_access_token', urlToken);
      setGoogleToken(urlToken);
      // clean up URL
      window.history.replaceState({}, document.title, pathname);
    } else if (tokenToUse && !googleToken) {
      setGoogleToken(tokenToUse);
    }

    // 2. Auth Guard & Trigger scan on load
    if (pathname.startsWith('/dashboard') && !tokenToUse) {
      console.log("[DEBUG] No token found, redirecting to login...");
      window.location.href = '/';
      return;
    }

    if (urlToken || (tokenToUse && pathname !== '/')) {
      if (scanCalledRef.current) return;
      scanCalledRef.current = true;
      if (pathname === '/') window.history.pushState({}, '', '/dashboard');
      
      console.log("[DEBUG] Found valid token. Firing backend scan to /api/gmail/scan...");
      setLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      fetch(`http://localhost:8000/api/gmail/scan?token=${tokenToUse}`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          setScanData(data);
          setLoading(false);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          if (err.name === 'AbortError') {
            console.error("Scan timed out on frontend after 60 seconds");
          } else {
            console.error("Failed to fetch scan data", err);
          }
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard');
  if (showDashboard) {
    return <Dashboard />;
  }

  if (pathname.startsWith('/connections/google')) {
    return <GoogleConnections />;
  }
  if (pathname.startsWith('/connections/github')) {
    return <GithubConnections />;
  }
  if (pathname.startsWith('/dormant-app/')) {
    return <DormantAppDetail />;
  }
  if (pathname.startsWith('/app/'))
    return <AppDetail />;
  if (pathname.startsWith('/connection-updated'))
    return <ConnectionUpdated />;

  const handleLogin = () => {
    setLoading(true);
    window.location.href = 'http://localhost:8000/api/google/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A666D] via-[#324145] to-[#1A1D1D] flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">

        {/* Left Content Column */}
        <div className="flex flex-col space-y-10">

          {/* Logo Context */}
          <div className="flex items-center space-x-3">
            <img src="/Logo.png" alt="Vitreous Logo" className="w-16 h-16" />
            <h2 className="text-white text-3xl font-serif font-bold tracking-wide">Vitreous</h2>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-white text-5xl lg:text-6xl font-serif font-bold leading-tight">
              See <span className="text-[#A2B5B0]">through</span> to<br />
              everything you've<br />
              given access to.
            </h1>
          </div>

          {/* Description Paragraph */}
          <p className="text-gray-300 text-lg leading-relaxed max-w-md font-sans font-light">
            Vitreous gives you complete clarity over your own data. Personalized security recommendations, data leak alerts, and permissions you've granted: all in one place.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6 pt-4">
            {loading ? (
              <div className="px-10 py-3.5 rounded-2xl bg-[#324145]/80 text-white font-medium border border-white/10 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-white border-white/20 rounded-full animate-spin"></div>
                <span className="ml-3">Connecting...</span>
              </div>
            ) : (
              <>
                <button onClick={handleLogin} className="px-10 py-3.5 rounded-2xl bg-[#324145]/80 hover:bg-[#324145] text-white font-medium border border-white/10 transition-colors">
                  Log In
                </button>
                <button onClick={handleLogin} className="px-10 py-3.5 rounded-2xl bg-[#324145]/80 hover:bg-[#324145] text-white font-medium border border-white/10 transition-colors">
                  Sign Up
                </button>
              </>
            )}
          </div>

        </div>

        {/* Right Constellation Graphic Placeholder */}
        <div className="relative h-[600px] w-full hidden lg:block">
          <img src="/Constellation.png" alt="constellation.png"></img>
        </div>

      </div>

    </div>
  );
}

export default App;