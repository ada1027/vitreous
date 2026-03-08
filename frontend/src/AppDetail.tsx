const imgAppIcon = "https://www.figma.com/api/mcp/asset/3e32cb71-5785-452b-8975-5b36638c5822"; // Pinterest icon
const imgLogo = "https://www.figma.com/api/mcp/asset/1d18b4f1-b185-4b8d-a1a2-3bbce0301d9f";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11"; // google nav
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7"; // github nav

interface AppDetailsData {
  name: string;
  icon: string;
  provider: string;
  sharedInfo: string[];
  dateShared: string;
}

// Example data - this should ideally come from route params or URL query
const appDetailsMap: Record<string, AppDetailsData> = {
  Pinterest: {
    name: 'Pinterest',
    icon: imgAppIcon,
    provider: 'Google',
    sharedInfo: ['email address', 'birth date'],
    dateShared: 'January 31, 2023',
  },
  Netflix: {
    name: 'Netflix',
    icon: 'https://www.figma.com/api/mcp/asset/fd0cbf1b-ea80-4d9e-949d-631578233f41',
    provider: 'GitHub',
    sharedInfo: ['email address', 'username'],
    dateShared: 'February 15, 2023',
  },
  MyFitnessPal: {
    name: 'MyFitnessPal',
    icon: 'https://www.figma.com/api/mcp/asset/9787080e-c7b6-418c-a7fe-9e6467ced9e0',
    provider: 'Google',
    sharedInfo: ['email address', 'name', 'home address'],
    dateShared: 'March 1, 2023',
  },
  Amazon: {
    name: 'Amazon',
    icon: 'https://www.figma.com/api/mcp/asset/d3d2d663-93e6-403f-8c0f-e4c8145a7554',
    provider: 'Google',
    sharedInfo: ['email address', 'home address'],
    dateShared: 'March 5, 2023',
  },
  Indeed: {
    name: 'Indeed',
    icon: 'https://www.figma.com/api/mcp/asset/87acc487-661d-4a60-a99a-86a2adb0b6bd',
    provider: 'GitHub',
    sharedInfo: ['email address', 'name', 'date of birth'],
    dateShared: 'January 20, 2023',
  },
  Spotify: {
    name: 'Spotify',
    icon: 'https://www.figma.com/api/mcp/asset/468fc7fe-c22c-4f1c-ba42-98bfd21af7a3',
    provider: 'GitHub',
    sharedInfo: ['email address', 'home address'],
    dateShared: 'February 28, 2023',
  },
};

export default function AppDetail() {
  // Extract app name from URL search params
  const params = new URLSearchParams(window.location.search);
  const appName = params.get('app') || 'Pinterest';
  const provider = params.get('provider') || 'Google';
  
  const appData = appDetailsMap[appName] || appDetailsMap['Pinterest'];

  const handleRemove = () => {
    alert(`Removed connection: ${appName}`);
    window.history.back();
  };

  const handleContinue = () => {
    alert(`Continuing to allow ${appName}`);
    window.history.back();
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
        <img src={imgLogo} className="w-24 h-24" alt="logo" />
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/google')}>
          <div className={provider === 'Google' ? 'bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]' : ''}>
            <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
          </div>
        </div>
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/github')}>
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
        <p className="text-white text-lg mb-12 max-w-2xl">
          These this connection has access to the following information.
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
            <div>
              <p className="font-medium mb-2">Shared Information:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {appData.sharedInfo.map((info) => (
                  <li key={info}>{info}</li>
                ))}
              </ul>
            </div>
            <p>
              <span className="font-medium">Date shared:</span> {appData.dateShared}
            </p>
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
