import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  ExternalLink, 
  Globe, 
  Calendar, 
  ShieldCheck, 
  X,
  ChevronRight
} from 'lucide-react';
import type { DiscoveredPortal, MonitoredEvent } from '../types/sentinel';
import { sound } from '../utils/soundEffects';

interface SearchAndAddBarProps {
  catalog: DiscoveredPortal[];
  monitoredEvents: MonitoredEvent[];
  onAddEventFromCatalog: (portal: DiscoveredPortal) => void;
  onOpenCustomModal: () => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchAndAddBar: React.FC<SearchAndAddBarProps> = ({
  catalog,
  monitoredEvents,
  onAddEventFromCatalog,
  onOpenCustomModal,
  searchRef,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    sound.playPing();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 280);
  };

  const handleChipClick = (preset: string) => {
    setSearchTerm(preset);
    sound.playPing();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setIsDropdownOpen(true);
    }, 200);
  };

  const filteredPortals = catalog.filter((portal) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      portal.name.toLowerCase().includes(term) ||
      portal.organizer.toLowerCase().includes(term) ||
      portal.officialDomain.toLowerCase().includes(term) ||
      portal.tags.some((t) => t.toLowerCase().includes(term))
    );
  });

  const isAlreadyTracked = (domain: string, name: string) => {
    return monitoredEvents.some(
      (e) => e.officialDomain.toLowerCase() === domain.toLowerCase() || e.name.toLowerCase() === name.toLowerCase()
    );
  };

  return (
    <div ref={containerRef} className="relative w-full mb-8">
      {/* Search Input Container */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-[#111827] border border-[#1f2937] shadow-xl focus-within:border-[#f43f5e]/60 focus-within:ring-1 focus-within:ring-[#f43f5e]/40 transition-all">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isDropdownOpen) setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                }
              }}
              placeholder="Search hackathons, competitions (e.g. Smart India Hackathon 2026, Google Solution Challenge)..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSearchClick}
              disabled={isSearching}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f43f5e] to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-medium text-xs sm:text-sm shadow-lg shadow-rose-950/40 hover:shadow-rose-900/60 active:scale-[0.98] transition-all cursor-pointer font-sans"
            >
              {isSearching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Searching Portal...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Portal</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/80 px-2 overflow-x-auto text-xs text-slate-400 no-scrollbar">
          <span className="font-mono-tech text-[10px] uppercase text-slate-500 flex-shrink-0">
            Suggested Queries:
          </span>
          {['Smart India Hackathon 2026', 'Google Solution Challenge', 'OpenAI Frontier', 'Microsoft Imagine Cup'].map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/60 transition-colors whitespace-nowrap text-[11px] font-mono-tech"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Discovered Portals Dropdown / Drawer */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl bg-[#111827] border border-[#1f2937] shadow-2xl p-4 max-h-[480px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#fbbf24]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono-tech">
                Discovered Official Portals & Verified Deadlines ({filteredPortals.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenCustomModal();
                }}
                className="text-xs text-[#fbbf24] hover:underline font-mono-tech flex items-center gap-1"
              >
                + Custom URL entry
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredPortals.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-400">No pre-indexed portal matches &quot;{searchTerm}&quot;</p>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenCustomModal();
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                Add &quot;{searchTerm}&quot; via Custom URL
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPortals.map((portal) => {
                const tracked = isAlreadyTracked(portal.officialDomain, portal.name);
                return (
                  <div
                    key={portal.id}
                    className="p-3.5 rounded-xl bg-[#0b0f19] border border-[#1f2937] hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {portal.category}
                        </span>
                        <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {portal.confidence}% Match
                        </span>
                      </div>

                      <h4 className="font-semibold text-white text-sm group-hover:text-slate-100 transition-colors">
                        {portal.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{portal.organizer}</p>

                      <div className="mt-2 text-xs font-mono-tech flex items-center gap-1 text-slate-400">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-slate-300 truncate">{portal.officialDomain}</span>
                        <a
                          href={portal.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-[#fbbf24] ml-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1 text-[#fbbf24] font-mono-tech">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(portal.detectedDeadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-400 truncate">{portal.prizePool}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {portal.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono-tech px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {tracked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono-tech border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          Tracking
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playVerified();
                            onAddEventFromCatalog(portal);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbbf24]/10 hover:bg-[#fbbf24]/20 border border-[#fbbf24]/40 hover:border-[#fbbf24] text-[#fbbf24] text-xs font-medium font-sans transition-all active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Sentinel Watchlist
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
