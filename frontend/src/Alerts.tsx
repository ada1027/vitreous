import * as React from 'react';

const imgLogo = "https://www.figma.com/api/mcp/asset/92460199-ba19-47a6-8da1-845ae154e86e";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11";
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7";
const imgXIcon = "https://www.figma.com/api/mcp/asset/4d3db62a-79e5-4604-82df-3afa2eb46778";
const imgWarning = "https://www.figma.com/api/mcp/asset/38abb51e-d857-4bdd-b4fb-6a21c2d5388e";

interface Alert {
  id: string;
  title: string;
  description: string;
  appName: string;
  breachDate: string;
}

const alerts: Alert[] = [
  {
    id: 'flipaclip-1',
    title: 'Critical Security Alert',
    description: 'FlipaClip reported a data breach in November, 2024. Your information may be exposed.',
    appName: 'FlipaClip',
    breachDate: 'November 2024',
  },
  {
    id: 'flipaclip-2',
    title: 'Critical Security Alert',
    description: 'FlipaClip reported a data breach in November, 2024. Your information may be exposed.',
    appName: 'FlipaClip',
    breachDate: 'November 2024',
  },
];

export default function Alerts() {
  const [dismissedAlerts, setDismissedAlerts] = React.useState<Set<string>>(new Set());

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(new Set([...dismissedAlerts, alertId]));
  };

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id));

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
      <div className="flex-1 p-8 overflow-auto">
        {/* header */}
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-12">
          Alerts
        </h1>

        {/* alerts list */}
        <div className="space-y-6 max-w-4xl">
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white/10 rounded-3xl p-8 border-2 border-red-500/30 shadow-[0_0_10px_10px_rgba(238,84,84,0.25)]"
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
                    <h2 className="text-2xl font-bold mb-4">{alert.title}</h2>
                    <p className="text-gray-300 mb-4">{alert.description}</p>
                    <button
                      onClick={() => (window.location.href = `/alert/${encodeURIComponent(alert.appName)}?id=${alert.id}`)}
                      className="text-white underline hover:text-white/80 transition-colors"
                    >
                      View compromised information
                    </button>
                  </div>
                </div>

                {/* close button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                  title="Dismiss alert"
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {visibleAlerts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No alerts to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
