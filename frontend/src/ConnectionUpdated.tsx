// Connection confirmation/updated page
const imgLogo = "/Logo.png";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/ed29f973-aec6-4c47-9290-590da61a0a11"; // google nav
const imgGithubIcon = "https://www.figma.com/api/mcp/asset/4b9c73a1-3138-43c8-9a1c-c043c76412d7"; // github nav

export default function ConnectionUpdated() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get('provider') || 'Google';
  const action = params.get('action') || 'updated'; // 'updated' or 'removed'

  const handleBack = () => {
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
        <img src={imgLogo} className="w-24 h-24 cursor-pointer" alt="logo" onClick={() => (window.location.href = '/dashboard')} />
        <div className="relative">
          <div className={provider === 'Google' ? 'bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]' : ''}>
            <img src={imgGoogleIcon} className="w-12 h-12" alt="google" />
          </div>
        </div>
        <div className="relative">
          <div className={provider === 'GitHub' ? 'bg-gradient-to-b from-[#2c4451] to-[#606779] p-2 rounded-lg shadow-[0_0_250px_0_#696969,0_0_159.84px_0_#696969,0_0_93.24px_0_#696969,0_0_46.62px_0_#696969,0_0_13.32px_0_#696969,0_0_6.66px_0_#696969]' : ''}>
            <img src={imgGithubIcon} className="w-12 h-12" alt="github" />
          </div>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 p-8 overflow-auto flex flex-col">
        <h1 className="text-white text-5xl font-serif font-bold tracking-wide mb-4">
          Your Connection Details
        </h1>
        <p className="text-white text-lg mb-12">
          These connections have shared data from a linked account. Review the application below.
        </p>

        {/* confirmation card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/10 rounded-2xl p-12 max-w-2xl w-full relative min-h-80 flex flex-col items-center justify-center">
            <h2 className="text-5xl font-serif font-bold text-center mb-8">
              Your connection has been {action === 'removed' ? 'removed.' : 'updated.'}
            </h2>

            {/* Back link */}
            <button
              onClick={handleBack}
              className="absolute bottom-8 right-8 text-white underline font-medium hover:text-white/80 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
