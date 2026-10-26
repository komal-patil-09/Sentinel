import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { ActivityLogItem } from '../types/sentinel';

interface TerminalActivityLogProps {
  logs: ActivityLogItem[];
  onClearLogs: () => void;
}

export const TerminalActivityLog: React.FC<TerminalActivityLogProps> = ({
  logs,
  onClearLogs,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelBadge = (level: ActivityLogItem['level']) => {
    switch (level) {
      case 'alert':
        return (
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-rose-500/20 text-[#f43f5e] border border-rose-500/40 font-bold">
            [🚨 ALERT]
          </span>
        );
      case 'success':
        return (
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            [VERIFIED]
          </span>
        );
      case 'warn':
        return (
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-amber-500/10 text-[#fbbf24] border border-amber-500/30">
            [NOTICE]
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono-tech px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
            [WORKER]
          </span>
        );
    }
  };

  return (
    <div className="w-full mt-12 rounded-2xl bg-[#0b0f19] border border-[#1f2937] overflow-hidden shadow-2xl">
      {/* Terminal Titlebar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-3 bg-[#111827] border-b border-[#1f2937] flex items-center justify-between cursor-pointer select-none hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-xs font-mono-tech font-bold text-slate-200">
              SENTINEL_CRAWLER_TELEMETRY.LOG
            </span>
            <span className="text-[10px] font-mono-tech text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              LIVE STREAM ({logs.length})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {logs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearLogs();
              }}
              className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 text-xs flex items-center gap-1 font-mono-tech"
              title="Clear terminal stream"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <button className="p-1 text-slate-400 hover:text-white">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className={`font-mono-tech text-xs p-4 overflow-y-auto space-y-1.5 bg-[#0b0f19] text-slate-300 transition-all duration-300 ${
          isExpanded ? 'max-h-80' : 'max-h-36'
        }`}
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start gap-2 py-0.5 px-1 rounded transition-colors ${
              log.level === 'alert'
                ? 'bg-rose-950/20 text-rose-200 border-l-2 border-[#f43f5e]'
                : 'hover:bg-slate-900/50'
            }`}
          >
            <span className="text-slate-500 text-[11px] whitespace-nowrap">
              {log.timestamp}
            </span>
            {getLevelBadge(log.level)}
            <span className="flex-1 break-all text-[11px]">
              {log.message}
            </span>
            {log.latency && (
              <span className="text-slate-500 text-[10px] whitespace-nowrap">
                {log.latency}ms
              </span>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 animate-pulse">
          <span className="inline-block w-2 h-3 bg-[#fbbf24]" />
          <span>Crawler background worker listening for DOM mutations & RSS updates...</span>
        </div>
      </div>
    </div>
  );
};
