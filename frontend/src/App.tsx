import Dashboard from './Dashboard';
import GoogleConnections from './GoogleConnections';
import GithubConnections from './GithubConnections';
import AppDetail from './AppDetail';
import ConnectionUpdated from './ConnectionUpdated';

function App() {
  const pathname = window.location.pathname;
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
  if (pathname.startsWith('/app/'))
    return <AppDetail />;
  if (pathname.startsWith('/connection-updated'))
    return <ConnectionUpdated />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A666D] via-[#324145] to-[#1A1D1D] flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">
        
        {/* Left Content Column */}
        <div className="flex flex-col space-y-10">
          
          {/* Logo Context */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10 backdrop-blur-sm" />
              <div className="w-10 h-10 rounded-full bg-white/40 border border-white/20 backdrop-blur-md" />
            </div>
            <h2 className="text-white text-3xl font-serif font-bold tracking-wide">Vitreous</h2>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-white text-5xl lg:text-6xl font-serif font-bold leading-tight">
              See <span className="text-[#A2B5B0]">through</span> to<br/>
              everything you've<br/>
              given access to.
            </h1>
          </div>

          {/* Description Paragraph */}
          <p className="text-gray-300 text-lg leading-relaxed max-w-md font-sans font-light">
            Vitreous gives you complete clarity over your own data. Personalized security recommendations, data leak alerts, and permissions you've granted: all in one place.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6 pt-4">
            <button onClick={() => window.location.href = '/dashboard'} className="px-10 py-3.5 rounded-2xl bg-[#324145]/80 hover:bg-[#324145] text-white font-medium border border-white/10 transition-colors">
              Log In
            </button>
            <button onClick={() => window.location.href = '/dashboard'} className="px-10 py-3.5 rounded-2xl bg-[#324145]/80 hover:bg-[#324145] text-white font-medium border border-white/10 transition-colors">
              Sign Up
            </button>
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
