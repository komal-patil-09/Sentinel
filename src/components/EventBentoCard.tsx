import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Zap, 
  Clock, 
  RotateCcw, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { MonitoredEvent } from '../types/sentinel';
import { sound } from '../utils/soundEffects';

interface EventBentoCardProps {
  event: MonitoredEvent;
  onCheckNow: (id: string) => void;
  onSimulateShift: (id: string) => void;
  onRevertShift: (id: string) => void;
  onRemove: (id: string) => void;
}

export const EventBentoCard: React.FC<EventBentoCardProps> = ({
  event,
  onCheckNow,
  onSimulateShift,
  onRevertShift,
  onRemove,
}) => {
  // Real-time countdown calculation
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(event.currentDeadline).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event.currentDeadline]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const isShifted = event.shifted;
  const isChecking = event.status === 'checking';

  return (
    <div
      className={`relative rounded-2xl bg-[#111827] border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
        isShifted
          ? 'border-[#f43f5e]/60 bento-glow-coral'
          : 'border-[#1f2937] hover:border-slate-700 hover:shadow-2xl'
      }`}
    >
      {/* Top Accent Strip */}
      <div
        className={`h-1 w-full transition-colors duration-500 ${
          isShifted
            ? 'bg-gradient-to-r from-[#f43f5e] via-[#fbbf24] to-[#f43f5e]'
            : 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 group-hover:from-[#f43f5e]/40 group-hover:to-[#fbbf24]/40'
        }`}
      />

      {/* Main Card Body */}
      <div className="p-5 sm:p-6 flex-1">
        {/* Header: Status Beacon & Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            {isShifted ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f43f5e]/15 border border-[#f43f5e]/40 text-[#f43f5e] text-[11px] font-mono-tech font-bold tracking-tight">
                <span className="w-2 h-2 rounded-full bg-[#f43f5e] pulse-coral-dot"></span>
                🚨 SHIFT DETECTED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono-tech font-semibold tracking-tight">
                <span className="w-2 h-2 rounded-full bg-[#10b981] pulse-radar-dot"></span>
                ● Active Sentinel Watch
              </span>
            )}
            <span className="text-[10px] font-mono-tech text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
              {event.category}
            </span>
          </div>

          {/* Quick Remove Button */}
          <button
            onClick={() => onRemove(event.id)}
            title="Remove from Watchlist"
            className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-60 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Event Title & Organizer */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug group-hover:text-slate-100">
            {event.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
            <span>By {event.organizer}</span>
            {event.prizePool && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-[#fbbf24] font-mono-tech text-[11px]">{event.prizePool}</span>
              </>
            )}
          </p>
        </div>

        {/* Monitored Target URL with Monospace Chip */}
        <div className="mt-3.5 flex items-center justify-between text-xs font-mono-tech bg-[#0b0f19] px-3 py-2 rounded-lg border border-[#1f2937]">
          <div className="flex items-center gap-1.5 truncate text-slate-400 mr-2">
            <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-slate-300 truncate">{event.officialDomain}</span>
            <span className="text-slate-600 text-[10px]">/xpath</span>
          </div>
          <a
            href={event.portalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-[#fbbf24] flex items-center gap-1 flex-shrink-0 transition-colors"
            title="Open official portal"
          >
            <span className="text-[10px]">portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Deadline Display Section with Dramatic Shift Strikethrough & Glow */}
        <div className="mt-4 p-4 rounded-xl bg-[#0b0f19]/80 border border-[#1f2937]">
          <p className="text-[11px] font-mono-tech uppercase text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#fbbf24]" />
              Tracked Official Deadline
            </span>
            {isShifted && (
              <span className="text-[10px] text-amber-400 font-bold tracking-tight bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                +{event.shiftDeltaDays || 16} DAYS EXTENSION
              </span>
            )}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            {isShifted ? (
              <div className="space-y-1">
                {/* Previous Deadline Crossed Out in Electric Coral */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono-tech text-rose-400 line-through decoration-rose-500 decoration-2 opacity-80">
                    {formatDate(event.originalDeadline)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {/* New Highlighted Deadline in Glowing Sunset Amber */}
                  <span className="text-xl sm:text-2xl font-bold font-mono text-[#fbbf24] drop-shadow-[0_0_12px_rgba(251,191,36,0.4)] animate-in fade-in zoom-in duration-300">
                    {formatDate(event.currentDeadline)}
                  </span>
                </div>
                {event.shiftReason && (
                  <p className="text-[11px] text-slate-400 italic">
                    Reason: {event.shiftReason}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                {formatDate(event.currentDeadline)}
              </div>
            )}
          </div>

          {/* Countdown Clock Display */}
          <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-900 text-center font-mono-tech">
            <div className="bg-[#111827] py-1 px-1 rounded border border-slate-800">
              <div className="text-base sm:text-lg font-bold text-white">{timeLeft.days}</div>
              <div className="text-[9px] text-slate-400 uppercase">Days</div>
            </div>
            <div className="bg-[#111827] py-1 px-1 rounded border border-slate-800">
              <div className="text-base sm:text-lg font-bold text-white">{timeLeft.hours}</div>
              <div className="text-[9px] text-slate-400 uppercase">Hours</div>
            </div>
            <div className="bg-[#111827] py-1 px-1 rounded border border-slate-800">
              <div className="text-base sm:text-lg font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-[9px] text-slate-400 uppercase">Mins</div>
            </div>
            <div className="bg-[#111827] py-1 px-1 rounded border border-slate-800">
              <div className="text-base sm:text-lg font-bold text-[#fbbf24]">{timeLeft.seconds}</div>
              <div className="text-[9px] text-slate-400 uppercase">Secs</div>
            </div>
          </div>
        </div>

        {/* Technical Diagnostics */}
        <div className="mt-3.5 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${event.lastStatusCode === 200 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            HTTP {event.lastStatusCode} OK ({event.pingLatencyMs}ms)
          </span>
          <span>Checked: {event.lastChecked}</span>
        </div>
      </div>

      {/* Card Actions Footer: Check Now + Dedicated Presentation Simulator Button */}
      <div className="p-4 sm:px-6 bg-[#0e1422] border-t border-[#1f2937] flex flex-col sm:flex-row items-center gap-2">
        {/* Check Now Button */}
        <button
          onClick={() => {
            sound.playPing();
            onCheckNow(event.id);
          }}
          disabled={isChecking}
          className={`w-full sm:w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold font-mono-tech transition-all cursor-pointer ${
            isChecking
              ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
              : 'bg-[#111827] hover:bg-slate-800 border-[#1f2937] hover:border-slate-600 text-slate-200'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-cyan-400' : 'text-[#fbbf24]'}`} />
          <span>{isChecking ? 'Scanning DOM...' : '⚡ Check Now'}</span>
        </button>

        {/* Dedicated Presentation Control: Simulate Deadline Shift */}
        {isShifted ? (
          <button
            onClick={() => {
              sound.playPing();
              onRevertShift(event.id);
            }}
            className="w-full sm:w-1/2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium font-sans transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Baseline</span>
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playShiftAlert();
              onSimulateShift(event.id);
            }}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#f43f5e] via-rose-600 to-[#fbbf24] hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold font-sans shadow-lg shadow-rose-950/50 hover:shadow-rose-900/70 active:scale-95 transition-all cursor-pointer group/btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover/btn:rotate-12 transition-transform" />
            <span>Simulate Shift</span>
          </button>
        )}
      </div>
    </div>
  );
};
