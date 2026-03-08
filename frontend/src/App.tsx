import Dashboard from './Dashboard';

function App() {
  const pathname = window.location.pathname;
  const showDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard');
  if (showDashboard) {
    return <Dashboard />;
  }

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
           {/* Connecting Lines */}
           <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.3))' }}>
              <path d="M 120 200 L 250 80 L 450 110 L 410 300 L 330 450 L 120 500" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              <path d="M 120 200 L 120 500" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
              <path d="M 120 200 L 330 450" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
           </svg>

           {/* Nodes */}
           <div className="absolute top-[75px] left-[245px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
           <div className="absolute top-[105px] left-[445px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
           <div className="absolute top-[295px] left-[405px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
           <div className="absolute top-[495px] left-[115px] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />

           {/* Central GitHub Star */}
           <div className="absolute top-[150px] left-[70px] flex items-center justify-center">
              <div className="w-24 h-24 bg-white clip-star relative z-10 shadow-[0_0_40px_rgba(150,180,255,0.6)] flex items-center justify-center pointer-events-none">
                 {/* Internal element to host the github logo precisely in crop */}
                 <svg height="32" viewBox="0 0 16 16" width="32" className="text-black z-20 absolute" style={{ top: '30px' }}>
                    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                 </svg>
              </div>
           </div>

           {/* Small Sub-Star */}
           <div className="absolute top-[410px] left-[290px]">
              <div className="w-12 h-12 bg-[#A2B5B0] clip-star shadow-[0_0_20px_rgba(162,181,176,0.6)]" />
           </div>

           {/* Bottom Right Google Star */}
           <div className="absolute top-[420px] left-[320px] flex items-center justify-center">
              <div className="w-32 h-32 bg-white clip-star relative z-10 shadow-[0_0_50px_rgba(150,180,255,0.8)] flex items-center justify-center">
                 <svg className="w-8 h-8 absolute z-20" style={{ top: '40px' }} viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
              </div>
           </div>
        </div>

      </div>

      <style>{`
        .clip-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          clip-path: polygon(50% 0%, 55% 45%, 100% 50%, 55% 55%, 50% 100%, 45% 55%, 0% 50%, 45% 45%);
        }
      `}</style>

    </div>
  );
}

export default App;
