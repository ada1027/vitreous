import { useState } from 'react';
import { useScan } from './context/ScanContext';

const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7";
const imgSearchIcon = "https://www.figma.com/api/mcp/asset/097c0775-4990-4f57-96a4-701e0a9d84e9";
const imgCheckmark = "https://www.figma.com/api/mcp/asset/56d0f9c3-989e-4704-a20f-cc5e071d1956";
const imgX = "https://www.figma.com/api/mcp/asset/4d3db62a-79e5-4604-82df-3afa2eb46778";

// fallback icons
const imgAmino = 'https://www.figma.com/api/mcp/asset/3fc1b0e4-94e9-4982-b5a1-cc768f6222f9';
const imgMyFitnessPal = 'https://www.figma.com/api/mcp/asset/3eee7340-f9b8-4740-920f-ee611179fcf5';
const imgQuora = 'https://www.figma.com/api/mcp/asset/da0f611f-50b6-4751-a4b2-57db8328ae1f';

const fallbackIcons: Record<string, string> = {
  'Amino': imgAmino,
  'MyFitnessPal': imgMyFitnessPal,
  'Quora': imgQuora,
};

interface DormantAccountsProps {
  onClose: () => void;
}

export default function DormantAccounts({ onClose }: DormantAccountsProps) {
  const { scanData, loading } = useScan();
  const [search, setSearch] = useState('');

  const handleKeep = (appName: string) => {
    alert(`Keeping connection: ${appName}`);
  };

  const handleRemove = (appName: string) => {
    alert(`Removed dormant connection: ${appName}`);
  };

  const handleAppClick = (appName: string, provider: string) => {
    // eslint-disable-next-line react-hooks/immutability
    window.location.href = `/dormant-app/${encodeURIComponent(appName)}?provider=${provider}`;
  };

  const rawServices = scanData?.services || [];
  const dormantServices = rawServices
    .filter(s => s.is_ghost)
    .filter(s => s.display_name.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

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
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={onClose} />
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/google')}>
          <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
        </div>
        <div className="relative cursor-pointer opacity-50" onClick={() => (window.location.href = '/connections/github')}>
          <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* header section */}
        <div className="mb-12">
          <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-4 flex items-center gap-4">
            Dormant Accounts
            {loading && <div className="w-6 h-6 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>}
          </h1>
          <p className="text-gray-300 text-lg max-w-4xl">
            These connections haven't been used within the past 2 years but still retain access to your information. Review their permissions and remove anything you no longer use.
          </p>
        </div>

        {/* search bar */}
        <div className="mb-12 flex items-center gap-4 bg-white/10 rounded-full px-6 py-4 max-w-2xl">
          <img src={imgSearchIcon} alt="search" className="w-6 h-6 opacity-75" />
          <input
            type="text"
            placeholder="Search for connections"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-white/50 outline-none flex-1"
          />
        </div>

        {/* apps list */}
        <div className="space-y-6 max-w-4xl">
          {dormantServices.length === 0 && !loading && (
            <div className="text-white/50 p-8 text-center bg-white/5 rounded-2xl">
              No dormant accounts found. Good job!
            </div>
          )}
          {dormantServices.map((app) => {
            const iconUrl = fallbackIcons[app.display_name] || null;
            return (
              <div
                key={app.id}
                className="bg-white/10 rounded-3xl p-6 flex items-start justify-between cursor-pointer hover:bg-white/15 transition-colors"
                onClick={() => handleAppClick(app.name, 'Google')}
              >
                {/* left content */}
                <div className="flex gap-6 flex-1">
                  {iconUrl ? (
                    <img src={iconUrl} alt={app.display_name} className="w-24 h-24 rounded-lg flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-lg flex-shrink-0 bg-white/5 flex items-center justify-center text-3xl font-bold border border-white/10">
                      {app.display_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium mb-2">{app.display_name}</h3>
                    <p className="text-gray-300 text-sm mb-2">Connected with Google</p>
                    <p className="text-gray-400 text-sm mb-2">Last used: {new Date(app.last_seen).toLocaleDateString()}</p>
                    <p className="text-gray-400 text-sm">Has access to: {app.data_shared.join(', ')}</p>
                  </div>
                </div>

                {/* action buttons */}
                <div
                  className="flex gap-4 flex-shrink-0 ml-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleKeep(app.display_name)}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-green-500/20 transition-colors"
                    title="Keep connection"
                  >
                    <img src={imgCheckmark} alt="keep" className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => handleRemove(app.display_name)}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-red-500/20 transition-colors"
                    title="Remove connection"
                  >
                    <img src={imgX} alt="remove" className="w-6 h-6" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
