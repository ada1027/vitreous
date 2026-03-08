import { useScan } from './context/ScanContext';

const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7";

// fallback icons
const imgAmino = 'https://www.figma.com/api/mcp/asset/3fc1b0e4-94e9-4982-b5a1-cc768f6222f9';
const imgMyFitnessPal = 'https://www.figma.com/api/mcp/asset/3eee7340-f9b8-4740-920f-ee611179fcf5';
const imgQuora = 'https://www.figma.com/api/mcp/asset/da0f611f-50b6-4751-a4b2-57db8328ae1f';

const fallbackIcons: Record<string, string> = {
  'Amino': imgAmino,
  'MyFitnessPal': imgMyFitnessPal,
  'Quora': imgQuora,
};

export default function DormantAppDetail() {
  const { scanData } = useScan();

  // Extract app name from URL search params
  const params = new URLSearchParams(window.location.search);
  const appNameParam = window.location.pathname.split('/').pop();
  const appName = appNameParam ? decodeURIComponent(appNameParam) : '';
  const provider = params.get('provider') || 'Google';

  const rawServices = scanData?.services || [];
  const appData = rawServices.find(s => s.name === appName || s.display_name === appName);

  const handleRemove = () => {
    window.location.href = `/connection-updated?provider=${provider}&action=removed&app=${encodeURIComponent(appName || '')}`;
  };

  const handleKeep = () => {
    window.location.href = `/dormant`;
  };

  if (!appData) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center bg-[#121819]">
        <p>App details not found or loading...</p>
      </div>
    );
  }

  const iconUrl = fallbackIcons[appData.display_name] || null;

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
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={() => (window.location.href = '/dashboard')} />
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/google')}>
          <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
        </div>
        <div className="relative cursor-pointer opacity-50" onClick={() => (window.location.href = '/connections/github')}>
          <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-4">
          Dormant Account Details
        </h1>
        <p className="text-white text-lg mb-12 max-w-2xl text-center">
          This account hasn't been used in over 2 years but still has access to your data.
        </p>

        {/* detail card */}
        <div className="bg-white/10 rounded-2xl p-8 max-w-2xl w-full">
          {/* app header */}
          <div className="flex items-center gap-6 mb-8">
            {iconUrl ? (
              <img src={iconUrl} className="w-20 h-20 rounded-lg" alt={appData.display_name} />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-white/5 flex items-center justify-center text-3xl font-bold border border-white/10">
                {appData.display_name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-5xl font-medium">{appData.display_name}</h2>
              {appData.category && <p className="text-white/50 mt-1">{appData.category}</p>}
            </div>
          </div>

          {/* details */}
          <div className="space-y-4 mb-8 text-sm">
            <p>
              <span className="font-medium text-white/50">Account connection:</span> {provider}
            </p>
            <p>
              <span className="font-medium text-white/50">Last used:</span> {new Date(appData.last_seen).toLocaleDateString()}
              <span className="text-red-400 font-bold ml-2">({appData.days_since_contact} days ago)</span>
            </p>
            <div>
              <p className="font-medium mb-2 text-white/50">Access to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {appData.data_shared.map((info) => (
                  <li key={info}>{info}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/20">
              <h3 className="font-medium text-yellow-500 mb-1">Recommendation</h3>
              <p className="text-yellow-100">{appData.priority_action}</p>
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
              onClick={handleKeep}
              className="bg-green-500/20 border border-green-500/50 rounded-full px-8 py-3 font-medium hover:bg-green-500/30 transition-colors"
            >
              Keep Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
