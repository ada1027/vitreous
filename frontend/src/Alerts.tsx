import * as React from 'react';
import { useScan } from './context/ScanContext';

const imgLogo = "https://www.figma.com/api/mcp/asset/92460199-ba19-47a6-8da1-845ae154e86e";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7";

interface AlertsProps {
  onClose: () => void;
}

export default function Alerts({ onClose }: AlertsProps) {
  const { scanData, loading } = useScan();
  const [dismissedAlerts, setDismissedAlerts] = React.useState<Set<string>>(new Set());
  const [expandedAlerts, setExpandedAlerts] = React.useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(new Set([...dismissedAlerts, alertId]));
  };

  const toggleExpand = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const rawServices = scanData?.services || [];
  const breachedServices = rawServices.filter(s => s.is_breached);
  
  const visibleAlerts = breachedServices.filter(s => !dismissedAlerts.has(s.id));

  // Format month, year
  const formatBreachDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown Date';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
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
        {/* header */}
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-12 flex items-center gap-4">
          Alerts
          {loading && <div className="w-6 h-6 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>}
        </h1>

        {/* alerts list */}
        <div className="space-y-6 max-w-4xl">
          {visibleAlerts.map((service) => {
            const breach = service.breaches?.[0];
            const isExpanded = expandedAlerts.has(service.id);
            const breachTitle = breach ? breach.Title : `${service.display_name} Data Breach`;
            const formattedDate = breach ? formatBreachDate(breach.BreachDate) : 'Recently';

            return (
              <div
                key={service.id}
                className="bg-white/10 rounded-3xl p-8 border-2 border-red-500/30 shadow-[0_0_10px_10px_rgba(238,84,84,0.25)] transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex gap-6 flex-1">
                    {/* warning icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                        ⚠️
                      </div>
                    </div>

                    {/* alert content */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-4">{breachTitle}</h2>
                      <p className="text-gray-300 mb-4">
                        {service.display_name} reported a data breach in {formattedDate}. Your information may be exposed.
                      </p>
                      <button
                        onClick={() => toggleExpand(service.id)}
                        className="text-white underline hover:text-white/80 transition-colors"
                      >
                        {isExpanded ? 'Hide compromised information' : 'View compromised information'}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-6 space-y-4">
                          <div className="p-4 bg-red-950/40 rounded-xl border border-red-500/20 text-red-100">
                            <h3 className="font-semibold mb-2">Compromised Data</h3>
                            <ul className="list-disc list-inside mb-4 text-sm opacity-90">
                              {breach?.DataClasses?.map((cls: string) => (
                                <li key={cls}>{cls}</li>
                              ))}
                            </ul>
                            <h3 className="font-semibold mb-2">Details</h3>
                            <p className="text-sm opacity-80" dangerouslySetInnerHTML={{ __html: breach?.Description || 'No description available.' }}></p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-white">
                            <h3 className="font-semibold mb-2">Recommended Action</h3>
                            <p className="text-sm text-gray-300">{service.priority_action}</p>
                          </div>
                          <div className="mt-4 flex gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/app/${encodeURIComponent(service.name)}?provider=Google`;
                              }}
                              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
                            >
                              Manage Connection Details
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* close button */}
                  <button
                    onClick={() => handleDismiss(service.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                    title="Dismiss alert"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {visibleAlerts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No alerts to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
