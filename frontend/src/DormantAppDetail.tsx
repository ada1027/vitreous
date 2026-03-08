const imgLogo = "https://www.figma.com/api/mcp/asset/92460199-ba19-47a6-8da1-845ae154e86e";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7";

interface DormantAppDetailsData {
  name: string;
  icon: string;
  provider: string;
  accessTo: string[];
  lastUsed: string;
}

// Map of dormant app details
const dormantAppDetailsMap: Record<string, DormantAppDetailsData> = {
  Amino: {
    name: 'Amino',
    icon: 'https://www.figma.com/api/mcp/asset/3fc1b0e4-94e9-4982-b5a1-cc768f6222f9',
    provider: 'Google',
    accessTo: ['email', 'name'],
    lastUsed: 'December 2024',
  },
  MyFitnessPal: {
    name: 'MyFitnessPal',
    icon: 'https://www.figma.com/api/mcp/asset/3eee7340-f9b8-4740-920f-ee611179fcf5',
    provider: 'Google',
    accessTo: ['email', 'name', 'address', 'health data'],
    lastUsed: 'April 2023',
  },
  Quora: {
    name: 'Quora',
    icon: 'https://www.figma.com/api/mcp/asset/da0f611f-50b6-4751-a4b2-57db8328ae1f',
    provider: 'GitHub',
    accessTo: ['email', 'name', 'age'],
    lastUsed: 'August 2022',
  },
};

export default function DormantAppDetail() {
  // Extract app name from URL search params
  const params = new URLSearchParams(window.location.search);
  const appNameParam = window.location.pathname.split('/').pop() || 'Amino';
  const appName = decodeURIComponent(appNameParam);
  const provider = params.get('provider') || 'Google';

  const appData = dormantAppDetailsMap[appName] || dormantAppDetailsMap['Amino'];

  const handleRemove = () => {
    window.location.href = `/connection-updated?provider=${provider}&action=removed&app=${encodeURIComponent(appName)}`;
  };

  const handleKeep = () => {
    window.location.href = `/dormant`;
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
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={() => (window.location.href = '/dashboard')} />
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/google')}>
          <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
        </div>
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/github')}>
          <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-4">
          Dormant Account Details
        </h1>
        <p className="text-white text-lg mb-12 max-w-2xl">
          This account hasn't been used in over 2 years but still has access to your data.
        </p>

        {/* detail card */}
        <div className="bg-white/10 rounded-2xl p-8 max-w-2xl w-full">
          {/* app header */}
          <div className="flex items-center gap-6 mb-8">
            <img src={appData.icon} className="w-20 h-20 rounded-lg" alt={appData.name} />
            <h2 className="text-5xl font-medium">{appData.name}</h2>
          </div>

          {/* details */}
          <div className="space-y-4 mb-8 text-sm">
            <p>
              <span className="font-medium">Account connection:</span> {appData.provider}
            </p>
            <p>
              <span className="font-medium">Last used:</span> {appData.lastUsed}
            </p>
            <div>
              <p className="font-medium mb-2">Access to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {appData.accessTo.map((info) => (
                  <li key={info}>{info}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* buttons */}
          <div className="flex gap-6 justify-center">
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
