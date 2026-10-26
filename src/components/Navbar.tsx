import React, { useState } from 'react';
import { 
  Radar, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  LogOut, 
  Mail, 
  Sparkles, 
  Search, 
  BellRing, 
  ChevronDown 
} from 'lucide-react';
import type { UserProfile } from '../types/sentinel';
import { sound } from '../utils/soundEffects';

interface NavbarProps {
  user: UserProfile;
  onToggleAuth: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeWatchCount: number;
  shiftAlertCount: number;
  onOpenSearchFocus: () => void;
  onOpenCustomModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onToggleAuth,
  soundEnabled,
  onToggleSound,
  activeWatchCount,
  shiftAlertCount,
  onOpenSearchFocus,
  onOpenCustomModal,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f2937] bg-[#0b0f19]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900 border border-[#1f2937] shadow-inner group-hover:border-[#f43f5e]/60 transition-colors">
              <Radar className="w-5 h-5 text-[#f43f5e] group-hover:rotate-45 transition-transform duration-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10b981] pulse-radar-dot"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-lg font-sans">
                  SENTINEL
                </span>
                <span className="text-[10px] uppercase font-mono-tech px-1.5 py-0.5 rounded border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-[#f43f5e] font-semibold">
                  v2.4-PROD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-tech flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                CRAWLER: NOMINAL <span className="text-slate-600">|</span> 100% UPTIME
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search / Hotkey trigger */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => {
              sound.playPing();
              onOpenSearchFocus();
            }}
            className="flex items-center space-x-3 px-4 py-1.5 rounded-lg bg-[#111827] border border-[#1f2937] hover:border-[#374151] text-slate-400 hover:text-slate-200 transition-all text-xs font-mono-tech w-64 justify-between group shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#fbbf24] group-hover:text-amber-300 transition-colors" />
              <span>Search portals...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right Section: Telemetry, Audio, and Auth Mock */}
        <div className="flex items-center space-x-3">
          {/* Custom URL add trigger */}
          <button
            onClick={() => {
              sound.playPing();
              onOpenCustomModal();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-[#fbbf24]/50 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span>+ Custom Target</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) sound.playPing();
            }}
            title={soundEnabled ? 'Mute UI Synthesizer' : 'Enable Cyber Audio Feedback'}
            className="p-2 rounded-lg bg-[#111827] border border-[#1f2937] text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#fbbf24]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Shift alerts pill */}
          {shiftAlertCount > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f43f5e]/15 border border-[#f43f5e]/40 text-[#f43f5e] text-xs font-mono-tech animate-pulse">
              <BellRing className="w-3.5 h-3.5" />
              <span>{shiftAlertCount} SHIFT{shiftAlertCount > 1 ? 'S' : ''}</span>
            </div>
          )}

          {/* Google Auth Mock Section */}
          <div className="relative">
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 pl-2 pr-3 py-1 rounded-full bg-[#111827] border border-[#1f2937] hover:border-slate-600 transition-all text-xs text-slate-200"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-6 h-6 rounded-full border border-emerald-500/50 object-cover"
                  />
                  <span className="font-medium hidden sm:inline">{user.name}</span>
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#111827] border border-[#1f2937] shadow-2xl py-3 px-4 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center space-x-3 pb-3 border-b border-[#1f2937]">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-[#fbbf24]/50"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 font-mono-tech truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#fbbf24]" />
                          Email Dispatch:
                        </span>
                        <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                          INSTANT
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#f43f5e]" />
                          Watchlist Capacity:
                        </span>
                        <span className="text-slate-400 font-mono-tech">{activeWatchCount} Active Targets</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1f2937]">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onToggleAuth();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Google</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  sound.playVerified();
                  onToggleAuth();
                }}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#111827] hover:bg-[#1a2333] border border-[#1f2937] hover:border-slate-600 transition-all text-xs font-medium text-slate-200 group shadow-sm"
              >
                {/* Official Google G Logo */}
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span className="group-hover:text-white">Sign In with Google</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
