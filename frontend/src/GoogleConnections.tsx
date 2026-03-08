import { useState } from 'react';
import { useScan } from './context/ScanContext';

// Google-specific connections page
const imgSearch = "https://www.figma.com/api/mcp/asset/3b8723bd-848a-4b89-84bf-fb2f1cfd176e";
const imgThreeDots = "https://www.figma.com/api/mcp/asset/07adea7f-1661-492f-9c72-6753874078e3";
const imgFilter = "https://www.figma.com/api/mcp/asset/4056d343-f118-457a-980d-998170449f3d";
const imgSort = "https://www.figma.com/api/mcp/asset/cb00f331-3450-4cb5-8a19-f557da44a5bf";
const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/a293c88c-33e0-47b2-873b-2c6253f84752"; // google nav
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/33207a9e-280b-4adf-b883-50b767ad3dda"; // github nav

// fallback icons
const imgPinterest = "https://www.figma.com/api/mcp/asset/41deae14-68bf-4342-bedf-127d5a7bc550";
const imgMyFitnessPal = "https://www.figma.com/api/mcp/asset/9787080e-c7b6-418c-a7fe-9e6467ced9e0";
const imgAmazon = "https://www.figma.com/api/mcp/asset/d3d2d663-93e6-403f-8c0f-e4c8145a7554";

const fallbackIcons: Record<string, string> = {
  'Pinterest': imgPinterest,
  'MyFitnessPal': imgMyFitnessPal,
  'Amazon': imgAmazon,
};

export default function GoogleConnections() {
  const { scanData, loading } = useScan();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortByRecent, setSortByRecent] = useState(true);

  // default to empty array if no scanData
  const rawServices = scanData?.services || [];

  const uniqueCategories = Array.from(new Set(rawServices.map(s => s.category).filter(Boolean)));

  const filteredServices = rawServices
    .filter(s => s.display_name.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
    .filter(s => filterCategory ? s.category === filterCategory : true)
    .sort((a, b) => {
      // sort by last_seen
      const dateA = new Date(a.last_seen).getTime();
      const dateB = new Date(b.last_seen).getTime();
      return sortByRecent ? dateB - dateA : dateA - dateB;
    });

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
          <div className="bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]">
            <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
          </div>
        </div>
        <div className="relative cursor-pointer opacity-50" onClick={() => (window.location.href = '/connections/github')}>
          <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide flex items-center gap-4">
          Your connections
          {loading && <div className="w-6 h-6 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>}
        </h1>
        <p className="text-white mt-2 text-lg">
          Apps that have access to your data, through Google.
        </p>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-full max-w-xl">
            <img src={imgSearch} alt="search" className="w-5 h-5 rotate-90" />
            <input
              type="text"
              placeholder="Search for connections"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent placeholder-white/75 ml-3 flex-1 focus:outline-none"
            />
          </div>

          <div className="group relative">
            <button className="flex items-center bg-white/10 rounded-full px-4 py-2 space-x-2">
              <img src={imgFilter} alt="filter" className="w-6 h-6" />
              <span>{filterCategory || 'Filter'}</span>
            </button>
            <div className="absolute hidden group-hover:block mt-2 w-48 bg-[#2c4451] rounded-xl shadow-lg z-10 p-2">
              <div
                className={`p-2 hover:bg-white/10 rounded cursor-pointer ${!filterCategory ? 'bg-white/20' : ''}`}
                onClick={() => setFilterCategory(null)}
              >
                All Categories
              </div>
              {uniqueCategories.map(cat => (
                <div
                  key={cat}
                  className={`p-2 hover:bg-white/10 rounded cursor-pointer ${filterCategory === cat ? 'bg-white/20' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setSortByRecent(!sortByRecent)} className="flex items-center bg-white/10 rounded-full px-4 py-2 space-x-2 hover:bg-white/20">
            <img src={imgSort} alt="sort" className="w-6 h-6 transition-transform" style={{ transform: sortByRecent ? 'scaleY(1)' : 'scaleY(-1)' }} />
            <span>Sort: {sortByRecent ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* list of connections */}
        <div className="mt-8 space-y-6">
          {filteredServices.length === 0 && !loading && (
            <div className="text-white/50 p-8 text-center bg-white/5 rounded-2xl">
              No connections found matching your criteria.
            </div>
          )}
          {filteredServices.map((c) => {
            const iconUrl = fallbackIcons[c.display_name] || null;
            let borderClass = 'border border-transparent';
            if (c.risk_level === 'HIGH') borderClass = 'border border-red-500/50 shadow-[0_0_10px_2px_rgba(239,68,68,0.2)]';
            else if (c.risk_level === 'MEDIUM') borderClass = 'border border-amber-500/50';
            else if (c.risk_level === 'LOW') borderClass = 'border border-green-500/50';

            return (
              <div
                key={c.id}
                onClick={() => window.location.href = `/app/${encodeURIComponent(c.name)}?provider=Google`}
                className={`relative flex items-center bg-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all ${borderClass}`}
              >
                {iconUrl ? (
                  <img src={iconUrl} className="w-16 h-16" alt={c.display_name} />
                ) : (
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-xl font-bold border border-white/10">
                    {c.display_name.charAt(0)}
                  </div>
                )}
                <div className="ml-6 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-2xl font-medium">{c.display_name}</p>
                    {c.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/70">
                        {c.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">Has access to: {c.data_shared.join(', ')}</p>
                  <p className="text-xs text-white/50 mt-1">Last seen: {new Date(c.last_seen).toLocaleDateString()}</p>
                </div>
                <img src={imgThreeDots} className="w-6 h-6" alt="options" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
