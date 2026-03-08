import { useState } from 'react';
import { useScan } from './context/ScanContext';
import Alerts from './Alerts';
import DormantAccounts from './DormantAccounts';

// Figma asset URLs - these were provided in the design export
const imgImage1 = "https://www.figma.com/api/mcp/asset/e63a2a47-3162-4d09-b497-66f9dbd27d33"; // google logo
const imgImage2 = "https://www.figma.com/api/mcp/asset/ee71325c-460c-4213-a2cd-391c0c18ea3e"; // github logo
const imgImage7 = "https://www.figma.com/api/mcp/asset/92e49fcd-1210-4288-898d-d98a4dd21cc1"; // extra icon
const imgImage6 = "https://www.figma.com/api/mcp/asset/89e496b8-de41-48c1-ad03-7b9336a9cbdc"; // extra icon
const imgImage15 = "https://www.figma.com/api/mcp/asset/e240165a-273e-4426-9f15-965601e1645a"; // extra icon
const imgImage16 = "https://www.figma.com/api/mcp/asset/26c3d958-3a83-4396-9c06-ce344b667bcc"; // extra icon
const imgSlackLogo = "https://www.figma.com/api/mcp/asset/33207edf-fade-43fc-8e32-4861cfa4e026"; // slack logo

export default function Dashboard() {
  const { scanData, loading } = useScan();
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const [showDormant, setShowDormant] = useState<boolean>(false);
  const breachCount = scanData?.summary?.breached_count || 0;
  const dormantCount = scanData?.services?.filter(s => s.is_ghost)?.length || 0;
  const insightText = scanData?.insight || "Your security scan is complete. Review your connections below for specific recommendations.";

  if (loading) {
    return (
      <div className="min-h-screen relative text-white flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-[#4A666D] via-[#324145] to-[#1A1D1D]">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="flex flex-col items-center relative z-10 space-y-6">
          <div className="w-12 h-12 border-4 border-[#A2B5B0] border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-serif tracking-wide text-[#A2B5B0]">Scanning your accounts...</h2>
          <p className="text-gray-400 font-sans font-light">This usually takes around 5 to 10 seconds.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative text-white flex flex-col items-center p-8"
      style={{
        backgroundColor: '#121819',
        backgroundImage:
          'linear-gradient(180deg, rgba(26, 29, 29, 0.2) 28.846%, rgba(73, 110, 121, 0.2) 61.538%, rgba(79, 143, 162, 0.2) 100%), linear-gradient(90deg, rgba(18, 24, 25, 0.2) 0%, rgba(18, 24, 25, 0.2) 100%)',
      }}
    >
      {/* logo and header */}
      <div className="absolute top-8 left-8 flex items-center cursor-pointer" onClick={() => window.location.href = '/'}>
        <img src="/Logo.png" alt="Vitreous Logo" className="w-16 h-16" />
      </div>
      <h1 className="text-white text-5xl font-serif font-bold tracking-wide mt-20 flex items-center gap-4">
        Dashboard
        {loading && <div className="w-8 h-8 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>}
      </h1>

      {/* Insight Text */}
      <div className="w-full max-w-4xl mt-8 text-center text-emerald-100/90 font-serif text-xl px-4 leading-relaxed">
        {insightText}
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* alert/dormant cards */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div onClick={() => setShowAlerts(true)} className="cursor-pointer relative w-64 h-40 bg-white/10 rounded-2xl p-4 shadow-[0_0_10px_10px_rgba(238,84,84,0.25)] hover:bg-white/20 transition-colors">
            <div className="absolute left-4 top-4">
              <img src="/alert-icon.png" alt="Alert" className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-medium ml-12">Alerts</h2>
            <p className="text-sm ml-12 mt-2">{breachCount} data breaches detected</p>
          </div>
          <div onClick={() => setShowDormant(true)} className="cursor-pointer relative w-64 h-40 bg-white/10 rounded-2xl p-4 shadow-[0_0_10px_10px_rgba(255,242,202,0.25)] hover:bg-white/20 transition-colors">
            <div className="absolute left-4 top-4">
              <img src="/dormant-icon.png" alt="Dormant" className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-medium ml-12">Dormant</h2>
            <p className="text-sm ml-12 mt-2">
              Review {dormantCount} accounts not accessed &gt; 6 months
            </p>
          </div>
        </div>

        {/* linked accounts */}
        <h2 className="text-4xl font-serif mt-16">My Linked Accounts</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          <div 
            onClick={() => window.location.href = '/connections/google'} 
            className="cursor-pointer w-72 h-32 flex flex-col justify-center bg-white/10 rounded-2xl px-6 py-4 space-y-2 hover:bg-white/20 transition-all border border-transparent hover:border-white/10"
          >
            <div className="flex items-center gap-4">
              <img src={imgImage1} alt="Google" className="w-10 h-10" />
              <p className="text-2xl font-serif">Google</p>
            </div>
            <p className="text-sm font-sans text-emerald-100/70">{scanData?.summary?.total_services || 0} connections discovered</p>
          </div>

          <div 
            className="opacity-50 cursor-not-allowed w-72 h-32 flex flex-col justify-center bg-white/5 rounded-2xl px-6 py-4 space-y-2 border border-transparent"
          >
            <div className="flex items-center gap-4">
              <img src={imgImage2} alt="Github" className="w-10 h-10 grayscale" />
              <p className="text-2xl font-serif">Github</p>
            </div>
            <p className="text-sm font-sans text-gray-400">Coming Soon</p>
          </div>
        </div>

        {/* add more section */}
        <div className="self-start mt-16">
          <h3 className="text-3xl font-serif">Add More</h3>
          <div className="flex space-x-4 mt-4 bg-white/10 rounded-2xl px-4 py-2">
            <img src={imgImage7} className="w-10 h-10" alt="extra1" />
            <img src={imgImage6} className="w-10 h-10" alt="extra2" />
            <img src={imgImage15} className="w-10 h-10" alt="extra3" />
            <img src={imgImage16} className="w-10 h-10" alt="extra4" />
            <img src={imgSlackLogo} className="w-10 h-10" alt="Slack" />
          </div>
        </div>
      </div>

      {/* OVERLAY RENDERERS */}
      {showAlerts && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#121819] backdrop-blur-md">
          <Alerts onClose={() => setShowAlerts(false)} />
        </div>
      )}

      {showDormant && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#121819] backdrop-blur-md">
          <DormantAccounts onClose={() => setShowDormant(false)} />
        </div>
      )}

    </div>
  );
}
