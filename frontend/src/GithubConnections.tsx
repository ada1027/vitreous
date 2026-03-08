// GitHub-specific connections page
const imgSearch = "https://www.figma.com/api/mcp/asset/c7122240-3cef-4f9e-a66a-48b2d93bf653";
const imgThreeDots = "https://www.figma.com/api/mcp/asset/686b0c9e-d475-4f98-8884-aa40b03cfe04";
const imgFilter = "https://www.figma.com/api/mcp/asset/340af17f-1a26-49ed-8715-98d0d863abdb";
const imgSort = "https://www.figma.com/api/mcp/asset/47211a2a-28a5-4447-8374-4072ea86fac6";
const imgLogo = "https://www.figma.com/api/mcp/asset/44051d84-7f94-480d-ace7-a86cb0d5243f";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/fd0cbf1b-ea80-4d9e-949d-631578233f41"; // google nav (reused asset? from previous data)
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/87acc487-661d-4a60-a99a-86a2adb0b6bd"; // github nav

// github-specific connections
const imgNetflix = "https://www.figma.com/api/mcp/asset/fd0cbf1b-ea80-4d9e-949d-631578233f41";
const imgIndeed = "https://www.figma.com/api/mcp/asset/87acc487-661d-4a60-a99a-86a2adb0b6bd";
const imgSpotify = "https://www.figma.com/api/mcp/asset/468fc7fe-c22c-4f1c-ba42-98bfd21af7a3";

interface Connection {
  name: string;
  iconUrl?: string;
  details: string;
}

const dummyConnections: Connection[] = [
  { name: 'Netflix', iconUrl: imgNetflix, details: 'Has access to: email, name' },
  { name: 'Indeed', iconUrl: imgIndeed, details: 'Has access to: email, name, date of birth' },
  { name: 'Spotify', iconUrl: imgSpotify, details: 'Has access to: email, home address' },
];

export default function GithubConnections() {
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
          <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
        </div>
        <div className="relative cursor-pointer" onClick={() => (window.location.href = '/connections/github')}>
          <div className="bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]">
            <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide">
          Your connections
        </h1>
        <p className="text-white mt-2 text-lg">
          Apps that have access to your data, through GitHub.
        </p>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-full max-w-xl">
            <img src={imgSearch} alt="search" className="w-5 h-5 rotate-90" />
            <input
              type="text"
              placeholder="Search for connections"
              className="bg-transparent placeholder-white/75 ml-3 flex-1 focus:outline-none"
            />
          </div>
          <button className="flex items-center bg-white/10 rounded-full px-4 py-2 space-x-2">
            <img src={imgFilter} alt="filter" className="w-6 h-6" />
            <span>Filter</span>
          </button>
          <button className="flex items-center bg-white/10 rounded-full px-4 py-2 space-x-2">
            <img src={imgSort} alt="sort" className="w-6 h-6" />
            <span>Sort</span>
          </button>
        </div>

        {/* list of connections */}
        <div className="mt-8 space-y-6">
          {dummyConnections.map((c) => (
            <div
              key={c.name}
              onClick={() => window.location.href = `/app/${encodeURIComponent(c.name)}?provider=GitHub`}
              className="relative flex items-center bg-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
            >
              {c.iconUrl && (
                <img src={c.iconUrl} className="w-16 h-16" alt={c.name} />
              )}
              <div className="ml-6 flex-1">
                <p className="text-2xl font-medium">{c.name}</p>
                <p className="text-sm mt-1">{c.details}</p>
              </div>
              <img src={imgThreeDots} className="w-6 h-6" alt="options" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
