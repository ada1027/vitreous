import { useState, useEffect, useRef } from 'react';
import { useScan } from './context/ScanContext';
import { useNavigate } from 'react-router-dom';

const imgSearch = "https://www.figma.com/api/mcp/asset/3b8723bd-848a-4b89-84bf-fb2f1cfd176e";
const imgThreeDots = "https://www.figma.com/api/mcp/asset/07adea7f-1661-492f-9c72-6753874078e3";
const imgFilter = "https://www.figma.com/api/mcp/asset/4056d343-f118-457a-980d-998170449f3d";
const imgSort = "https://www.figma.com/api/mcp/asset/cb00f331-3450-4cb5-8a19-f557da44a5bf";
const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/a293c88c-33e0-47b2-873b-2c6253f84752";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/33207a9e-280b-4adf-b883-50b767ad3dda";

const getFaviconUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

export default function GoogleConnections() {
  const { scanData, setScanData, loading } = useScan();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [sortByRecent, setSortByRecent] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const analyzeTriggered = useRef(false);

  useEffect(() => {
    if (!scanData?.services || scanData.services.length === 0) return;
    const firstService = scanData.services[0];
    if (!firstService.risk_level && !firstService.category && !analyzeTriggered.current) {
      if (localStorage.getItem('vitreous_analyzed') === 'true') {
        return;
      }
      analyzeTriggered.current = true;
      setAnalyzing(true);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/gmail/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: scanData.services }),
      })
        .then(res => res.json())
        .then(data => {
          if (data?.services) {
            setScanData({ ...scanData, services: data.services, insight: data.insight || scanData.insight });
            localStorage.setItem('vitreous_analyzed', 'true');
          }
        })
        .catch(err => console.error('Analyze failed', err))
        .finally(() => setAnalyzing(false));
    }
  }, [scanData, setScanData]);

  const rawServices = scanData?.services || [];
  const uniqueCategories = Array.from(new Set(rawServices.map((s: any) => s.category).filter(Boolean)));

  const filteredServices = rawServices
    .filter((s: any) =>
      (s.service_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.domain || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter((s: any) => (filterCategory ? s.category === filterCategory : true))
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return sortByRecent ? dateB - dateA : dateA - dateB;
    });

  return (
    <div
      className="min-h-screen relative text-white flex"
      style={{
        backgroundColor: '#121819',
        backgroundImage:
          'linear-gradient(180deg, rgba(26, 29, 29, 0.2) 28.846%, rgba(73, 110, 121, 0.2) 61.538%, rgba(79, 143, 162, 0.2) 100%)',
      }}
    >
      {/* sidebar */}
      <div className="w-48 flex flex-col items-center py-8 space-y-8 bg-gradient-to-b from-[#2c4451] to-[#606779] shadow-[2px_3px_0px_0px_rgba(42,42,42,0.47)]">
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={() => navigate('/dashboard')} />
        <div className="relative cursor-pointer" onClick={() => navigate('/connections/google', { replace: true })}>
          <div className="bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_50px_0_#696969]">
            <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
          </div>
        </div>
        <div className="relative cursor-pointer opacity-50" onClick={() => navigate('/connections/github')}>
          <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide flex items-center gap-4">
          Your connections
          {loading && <div className="w-6 h-6 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>}
          {analyzing && (
            <span className="text-sm font-sans bg-[#324145]/80 px-3 py-1 rounded-full animate-pulse border border-white/10 text-emerald-100/70">
              Analyzing risks...
            </span>
          )}
        </h1>
        <p className="text-white mt-2 text-lg">Apps that have access to your data, through Google.</p>

        {/* controls */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2 w-full max-w-xl">
            <img src={imgSearch} alt="search" className="w-5 h-5" />
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
              {uniqueCategories.map((cat: any) => (
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
            <img src={imgSort} alt="sort" className="w-6 h-6" style={{ transform: sortByRecent ? 'scaleY(1)' : 'scaleY(-1)' }} />
            <span>Sort: {sortByRecent ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* list */}
        <div className="mt-8 space-y-4">
          {filteredServices.length === 0 && !loading && (
            <div className="text-white/50 p-8 text-center bg-white/5 rounded-2xl">
              No connections found.
            </div>
          )}
          {filteredServices.map((c: any) => {
            let borderClass = 'border border-transparent';
            if (c.risk_level === 'HIGH') borderClass = 'border border-red-500/50 shadow-[0_0_10px_2px_rgba(239,68,68,0.2)]';
            else if (c.risk_level === 'MEDIUM') borderClass = 'border border-amber-500/50';
            else if (c.risk_level === 'LOW') borderClass = 'border border-green-500/50';

            const name = c.service_name || c.domain || 'Unknown';

            return (
              <div
                key={c.domain}
                onClick={() => navigate(`/app/${encodeURIComponent(c.domain)}?provider=Google`, { state: { service: c } })}
                className={`relative flex items-center bg-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all ${borderClass}`}
              >
                <img
                  src={getFaviconUrl(c.domain)}
                  className="w-12 h-12 rounded-lg"
                  alt={name}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="ml-6 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-2xl font-medium">{name}</p>
                    {c.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/70">
                        {c.category}
                      </span>
                    )}
                    {c.is_breached && (
                      <span className="bg-red-500/20 text-red-300 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                        Breached
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60">Type: {c.type || 'unknown'}</p>
                  <p className="text-xs text-white/40 mt-1">Last seen: {c.date ? new Date(c.date).toLocaleDateString() : 'Unknown'}</p>
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