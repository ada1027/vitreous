import { useScan } from './context/ScanContext';

interface ConnectionDetailProps {
  domain: string;
  onClose: () => void;
}

export default function ConnectionDetail({ domain, onClose }: ConnectionDetailProps) {
  const { scanData } = useScan();
  
  // Find the matching service in our global state
  const service: any = scanData?.services?.find((s: any) => s.domain === domain || s.service_name === domain);
  
  const cleanName = service?.service_name || domain.split('.')[0] || "Unknown Service";
  const titleCaseName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  if (!service) {
    return (
      <div className="w-full h-full text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-serif text-[#A2B5B0] mb-4">Service Not Found</h2>
        <p className="text-gray-400 mb-8">We couldn't find connection details for {domain}.</p>
        <button 
          onClick={onClose}
          className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-white flex flex-col items-center pb-24 relative">
      <div className="absolute top-4 left-4 flex items-center cursor-pointer z-50" onClick={onClose}>
        <div className="flex items-center text-emerald-100/70 hover:text-white transition-colors bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </div>
      </div>
      
      <div className="w-full max-w-4xl mt-12 px-8">
        <div className="flex items-center space-x-6 mb-12">
          <div className="w-24 h-24 bg-[#2D3F44] rounded-full flex items-center justify-center text-5xl font-serif font-bold text-[#A2B5B0]">
            {titleCaseName.charAt(0)}
          </div>
          <div>
            <h1 className="text-5xl font-serif font-bold tracking-wide">{titleCaseName}</h1>
            <p className="text-xl text-emerald-100/70 mt-2">{domain}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-serif mb-6 text-[#A2B5B0]">Connection Details</h3>
            <div className="space-y-4 font-sans">
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-gray-400">Category</span>
                <span className="capitalize">{service.category || 'Other'}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-gray-400">Risk Level</span>
                <span className={`capitalize font-medium ${
                  service.risk_level?.toLowerCase() === 'high' ? 'text-red-400' :
                  service.risk_level?.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {service.risk_level || 'Low'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-4">
                <span className="text-gray-400">Active Pipeline</span>
                <span>{service.is_ghost ? 'Dormant' : 'Active'}</span>
              </div>
            </div>
            
            {service.priority_action && (
              <div className="mt-8 bg-[#324145]/50 border border-[#324145] rounded-xl p-4">
                <h4 className="text-sm text-[#A2B5B0] uppercase tracking-wider font-bold mb-2">Recommendation</h4>
                <p className="text-sm leading-relaxed">{service.priority_action}</p>
              </div>
            )}
          </div>

          <div className={`rounded-2xl p-8 ${service.is_breached ? 'bg-red-950/20 border border-red-500/20' : 'bg-white/5 border border-white/10'}`}>
            <h3 className="text-2xl font-serif mb-6 flex items-center gap-3">
              Security Status
              {service.is_breached ? (
                <span className="bg-red-500/20 text-red-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Breached
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Secure
                </span>
              )}
            </h3>
            
            {service.is_breached ? (
              <div className="space-y-4">
                <p className="text-red-200/80 mb-6 text-sm">
                  This service has been involved in {service.breach_count || 1} known data breach(es). We strongly recommend updating your password.
                </p>
                {/* We map default dummy breaches array locally since the backend logic wiped them to null */}
                <div className="bg-black/20 rounded-xl p-4 border border-red-500/10">
                  <p className="font-bold text-red-300 mb-1">Click to check HIBP domain history</p>
                  <p className="text-xs text-red-200/70">Asynchronous /check-domain HIBP API lookup available.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-emerald-100/50">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p>No known breaches associated with this service provider.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
