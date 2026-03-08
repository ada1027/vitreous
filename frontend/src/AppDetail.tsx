import { useScan } from './context/ScanContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11"; // google nav
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7"; // github nav

// fallback icons
const imgPinterest = "https://www.figma.com/api/mcp/asset/41deae14-68bf-4342-bedf-127d5a7bc550";
const imgMyFitnessPal = "https://www.figma.com/api/mcp/asset/9787080e-c7b6-418c-a7fe-9e6467ced9e0";
const imgAmazon = "https://www.figma.com/api/mcp/asset/d3d2d663-93e6-403f-8c0f-e4c8145a7554";

const fallbackIcons: Record<string, string> = {
  'Pinterest': imgPinterest,
  'MyFitnessPal': imgMyFitnessPal,
  'Amazon': imgAmazon,
};

export default function AppDetail() {
  const { scanData } = useScan();
  const location = useLocation();
  const navigate = useNavigate();
  const { domain } = useParams();
  
  const params = new URLSearchParams(location.search);
  const provider = params.get('provider') || 'Google';
  
  const rawServices = scanData?.services || [];
  const appData: any = location.state?.service || rawServices.find((s: any) => 
    s.domain === domain || 
    s.service_name === domain || 
    s.display_name === domain || 
    s.name === domain
  );

  const handleRemove = () => {
    navigate(`/connection-updated?provider=${provider}&action=removed&app=${encodeURIComponent(domain || '')}`);
  };

  const handleContinue = () => {
    navigate(`/connection-updated?provider=${provider}&action=allowed&app=${encodeURIComponent(domain || '')}`);
  };

  if (!appData) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center bg-[#121819]">
        <p>App details not found or loading...</p>
      </div>
    );
  }

  const iconUrl = fallbackIcons[appData.display_name] || null;

  const getModalBorder = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]';
      case 'MEDIUM': return 'border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]';
      case 'LOW': return 'border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]';
      default: return 'border border-white/10';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'HIGH': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'LOW': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div
      className="min-h-screen relative text-white flex"
      style={{
        backgroundColor: '#121819',
        backgroundImage:
          'linear-gradient(180deg, rgba(26, 29, 29, 0.2) 28.846%, rgba(73, 110, 121, 0.2) 61.538%, rgba(79, 143, 162, 0.2) 100%), linear-gradient(90deg, rgba(18, 24, 25, 0.2) 0%, rgba(18, 24, 25, 0.2) 100%)',
      }}
    >
      {/* sidebar */}
      <div className="w-48 flex flex-col items-center py-8 space-y-8 bg-gradient-to-b from-[#2c4451] to-[#606779] shadow-[2px_3px_0px_0px_rgba(42,42,42,0.47)]">
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={() => navigate('/dashboard')} />
        <div className="relative cursor-pointer" onClick={() => navigate('/connections/google')}>
          <div className={provider === 'Google' ? 'bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]' : ''}>
            <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
          </div>
        </div>
        <div className="relative cursor-pointer opacity-50" onClick={() => navigate('/connections/github')}>
          <div className={provider === 'GitHub' ? 'bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]' : ''}>
            <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-4">
          Your Connection Details
        </h1>
        <p className="text-white text-lg mb-12 max-w-2xl text-center">
          This connection has access to the following information.
        </p>

        {/* detail card */}
        <div className={`bg-white/10 rounded-2xl p-8 max-w-2xl w-full relative transition-all ${getModalBorder(appData.risk_level)}`}>
          
          <div className="absolute top-8 right-8">
            <span className={`px-4 py-1.5 rounded-full border text-sm font-medium ${getRiskColor(appData.risk_level)}`}>
              {appData.risk_level} RISK
            </span>
          </div>

          {/* app header */}
          <div className="flex items-center gap-6 mb-8">
            {iconUrl ? (
              <img src={iconUrl} className="w-20 h-20 rounded-lg" alt={appData.display_name || appData.service_name} />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center text-3xl font-bold border border-white/10">
                {(appData.display_name || appData.service_name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-5xl font-medium">{appData.display_name || appData.service_name || appData.domain}</h2>
              {appData.category && <p className="text-white/50 mt-1 capitalize">{appData.category}</p>}
            </div>
          </div>

          {/* details */}
          <div className="space-y-4 mb-8 text-sm">
            <p className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-medium text-white/50">Provider</span> 
              <span className="font-semibold">{provider}</span>
            </p>
            <p className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-medium text-white/50">Service Domain</span> 
              <span>{appData.domain || 'N/A'}</span>
            </p>
            <p className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-medium text-white/50">Category</span> 
              <span className="capitalize">{appData.category || 'Other'}</span>
            </p>
            <p className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-medium text-white/50">Connection Type</span> 
              <span className="capitalize">{appData.type || 'Unknown'}</span>
            </p>
            <p className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="font-medium text-white/50">Date Discovered</span> 
              <span>{appData.date || appData.first_seen ? new Date(appData.date || appData.first_seen).toLocaleDateString() : 'Unknown'}</span>
            </p>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 shadow-inner">
              <h3 className="font-medium text-emerald-100/70 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Recommendation
              </h3>
              <p className="leading-relaxed">{appData.priority_action || "Review this connection for any unnecessary permissions."}</p>
            </div>
          </div>

          {/* buttons */}
          <div className="flex gap-6 justify-center mt-12">
            <button
              onClick={handleRemove}
              className="bg-white/10 border border-red-500/50 rounded-full px-8 py-3 font-medium hover:bg-red-500/10 transition-colors"
            >
              Remove Connection
            </button>
            <button
              onClick={handleContinue}
              className="bg-green-500/20 border border-green-500/50 rounded-full px-8 py-3 font-medium hover:bg-green-500/30 transition-colors"
            >
              Continue Allowing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
