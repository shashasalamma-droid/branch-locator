
import React, { useState, useMemo } from 'react';
import { BRANCHES } from './constants';
import { UserLocation, AIResponse } from './types';
import { calculateDistance, formatDistance } from './utils';
import { getSmartLocationAdvice } from './services/geminiService';
import BranchCard from './components/BranchCard';

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const sortedBranches = useMemo(() => {
    if (!userLocation) return BRANCHES;
    return [...BRANCHES]
      .map(branch => ({
        ...branch,
        distance: calculateDistance(userLocation.coords, branch.coords)
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [userLocation]);

  const handleUseMyLocation = () => {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation({ coords });
        setIsLoadingLocation(false);
        setSearchQuery('My Current Position');
        
        const closest = [...BRANCHES]
          .map(b => ({ ...b, d: calculateDistance(coords, b.coords) }))
          .sort((a, b) => a.d - b.d)[0];
        
        handleAiAdvice('Current GPS Location', coords, formatDistance(closest.d));
      },
      () => {
        alert("Location access denied. Please type your town or city.");
        setIsLoadingLocation(false);
      }
    );
  };

  const handleAiAdvice = async (query: string, coords?: { lat: number, lng: number }, dist?: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const response = await getSmartLocationAdvice(query, coords || userLocation?.coords, dist);
      setAiResponse(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // If we have a GPS location, use the technical distance as a hint for the AI
      const distStr = sortedBranches[0]?.distance !== undefined && userLocation 
        ? formatDistance(sortedBranches[0].distance) 
        : undefined;
      handleAiAdvice(searchQuery, userLocation?.coords, distStr);
    }
  };

  const copySummaryToClipboard = () => {
    if (aiResponse) {
      navigator.clipboard.writeText(aiResponse.message);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const renderLogicPoints = (text: string) => {
    return text
      .split('\n')
      .map(line => line.replace(/^[\*\-\•\d\.\:\s]+/, '').trim())
      .filter(line => line.length > 2)
      .slice(0, 6)
      .map((point, i) => {
        const lp = point.toLowerCase();
        const isDistance = lp.includes('km') || lp.includes('distance') || lp.includes('approx');
        const isTime = lp.includes('mins') || lp.includes('hours') || lp.includes('time') || lp.includes('drive') || lp.includes('via') || lp.includes('highway');
        const isTransport = lp.includes('lrt') || lp.includes('mrt') || lp.includes('ktm') || lp.includes('bus') || lp.includes('transport') || lp.includes('terminal');
        const isAddress = lp.includes('jalan') || lp.includes('no.') || lp.includes('block') || lp.includes('taman') || lp.includes('lebuhraya');

        let colorClass = 'text-slate-100';
        let dotClass = 'bg-slate-500';
        
        if (isDistance) { colorClass = 'text-emerald-300'; dotClass = 'bg-emerald-400'; }
        else if (isTime) { colorClass = 'text-amber-300'; dotClass = 'bg-amber-400'; }
        else if (isTransport) { colorClass = 'text-blue-300'; dotClass = 'bg-blue-400'; }
        else if (isAddress) { colorClass = 'text-slate-300'; dotClass = 'bg-slate-400'; }

        return (
          <li key={i} className={`flex gap-4 text-[13px] font-semibold py-3 border-b border-slate-700/30 last:border-0 items-start ${colorClass} transition-all duration-300 animate-in fade-in slide-in-from-left-2`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`w-1.5 h-1.5 rounded-full ${dotClass} shadow-[0_0_8px_rgba(255,255,255,0.2)] mt-1.5 flex-shrink-0`}></div>
            <span className="leading-tight">{point}</span>
          </li>
        );
      });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <header className="bg-[#0f172a] text-white shadow-lg border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-xs font-black text-white">iS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">i-Sihat & T.low Dental</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Internal Staff Portal</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-emerald-400 font-black uppercase">Geo-Intelligence Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Malaysia-Wide Referral
            </h2>
            <form onSubmit={handleSearchSubmit} className="space-y-4">
              <div className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter ANY location in Malaysia..."
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 font-bold text-sm transition-all"
                />
                <button 
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLoadingLocation}
                  className="absolute right-3 top-3 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  <svg className={`w-5 h-5 ${isLoadingLocation ? 'animate-spin text-emerald-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </button>
              </div>
              <button 
                type="submit"
                disabled={isAiLoading || !searchQuery}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-sm shadow-lg disabled:opacity-50"
              >
                {isAiLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Mapping Location...
                  </div>
                ) : 'Find Nearest Branch'}
              </button>
            </form>
          </div>

          {(isAiLoading || aiResponse) && (
            <div className="bg-[#1e293b] rounded-2xl p-6 text-white shadow-xl border border-slate-700 ring-2 ring-emerald-500 ring-opacity-10 relative overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Target Branch Summary</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase tracking-tighter">Verified Result</span>
              </div>
              {isAiLoading ? (
                <div className="space-y-5 py-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                      <div className="h-2 bg-slate-700 rounded-full w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <ul className="list-none m-0 p-0">
                    {renderLogicPoints(aiResponse?.message || '')}
                  </ul>
                  <button 
                    onClick={copySummaryToClipboard}
                    className={`mt-4 w-full py-2.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copiedSummary ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                  >
                    {copiedSummary ? 'Summary Copied!' : 'Copy Summary for Patient'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              Full Branch Registry
            </h3>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {BRANCHES.length} Active Branches
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {sortedBranches.map((branch, index) => (
              <BranchCard 
                key={branch.id} 
                branch={branch} 
                isNearest={index === 0 && !!userLocation} 
              />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <span>&copy; 2025 i-Sihat & T.low Dental Group - Organizational Tool</span>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 text-blue-500"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Malaysian Transit Data</span>
            <span className="flex items-center gap-1.5 text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Any Location Mapping</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;