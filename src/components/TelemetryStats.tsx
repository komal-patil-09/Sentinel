import React from 'react';
import { Activity, ShieldAlert, Cpu, Radio, Zap } from 'lucide-react';
import type { MonitoredEvent } from '../types/sentinel';

interface TelemetryStatsProps {
  events: MonitoredEvent[];
  isCrawling: boolean;
  onTriggerCheckAll: () => void;
}

export const TelemetryStats: React.FC<TelemetryStatsProps> = ({
  events,
  isCrawling,
  onTriggerCheckAll,
}) => {
  const activeCount = events.length;
  const shiftedCount = events.filter((e) => e.shifted).length;
  const avgLatency = Math.round(
    events.reduce((acc, curr) => acc + curr.pingLatencyMs, 0) / (events.length || 1)
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Metric 1: Active Targets */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-between shadow-sm hover:border-[#374151] transition-all">
        <div>
          <p className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#10b981]" />
            Active Sentinels
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{activeCount}</span>
            <span className="text-xs text-emerald-400 font-mono-tech">100% ONLINE</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Metric 2: Median Latency */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-between shadow-sm hover:border-[#374151] transition-all">
        <div>
          <p className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
            Avg Scraping Ping
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-white">{avgLatency}</span>
            <span className="text-xs text-slate-400 font-mono-tech">ms / 200 OK</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {/* Metric 3: Shift Detections */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-between shadow-sm hover:border-[#374151] transition-all">
        <div>
          <p className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#f43f5e]" />
            Shift Detections
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold font-mono ${shiftedCount > 0 ? 'text-[#f43f5e]' : 'text-slate-300'}`}>
              {shiftedCount}
            </span>
            <span className="text-xs text-slate-400 font-mono-tech">
              {shiftedCount > 0 ? 'ALERT BROADCAST' : 'ZERO CONFLICTS'}
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#f43f5e]/10 border border-[#f43f5e]/20 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-[#f43f5e]" />
        </div>
      </div>

      {/* Metric 4: Crawler Control */}
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-between shadow-sm hover:border-[#374151] transition-all">
        <div>
          <p className="text-[11px] font-mono-tech text-slate-400 uppercase tracking-wider">
            Crawler Worker
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <button
              onClick={onTriggerCheckAll}
              disabled={isCrawling}
              className={`px-3 py-1 rounded text-xs font-mono-tech font-medium transition-all flex items-center gap-1.5 ${
                isCrawling
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait'
                  : 'bg-slate-800 hover:bg-[#fbbf24]/20 hover:border-[#fbbf24]/50 border border-slate-700 text-slate-200 hover:text-[#fbbf24]'
              }`}
            >
              <Zap className={`w-3 h-3 ${isCrawling ? 'animate-spin text-[#fbbf24]' : 'text-[#fbbf24]'}`} />
              {isCrawling ? 'PROBING ALL...' : 'POLL ALL TARGETS'}
            </button>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            AUTO-SYNC 60S
          </span>
        </div>
      </div>
    </div>
  );
};
