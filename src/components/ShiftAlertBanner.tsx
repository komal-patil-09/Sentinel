import React from 'react';
import { ShieldAlert, Mail, X, ArrowRight, ExternalLink } from 'lucide-react';
import type { MonitoredEvent } from '../types/sentinel';

interface ShiftAlertBannerProps {
  event: MonitoredEvent | null;
  onOpenEmail: () => void;
  onDismiss: () => void;
}

export const ShiftAlertBanner: React.FC<ShiftAlertBannerProps> = ({
  event,
  onOpenEmail,
  onDismiss,
}) => {
  if (!event) return null;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-lg w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="rounded-2xl bg-[#111827] border-2 border-[#f43f5e] shadow-[0_0_35px_rgba(244,63,94,0.35)] p-4 sm:p-5 text-white relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f43f5e]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#f43f5e] animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono-tech font-bold tracking-widest text-[#f43f5e] bg-[#f43f5e]/10 px-2 py-0.5 rounded border border-[#f43f5e]/30">
                CRITICAL BROADCAST
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Deadline Shift Detected!
              </h4>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-[#0b0f19] border border-[#1f2937]">
          <p className="text-xs font-semibold text-slate-200">{event.name}</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs font-mono-tech">
            <span className="text-rose-400 line-through decoration-rose-500 opacity-80">
              {formatDate(event.originalDeadline)}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-amber-400 font-bold">
              {formatDate(event.currentDeadline)} (+{event.shiftDeltaDays || 16} days)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Official portal updated with extended timeline announcement.
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onOpenEmail}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#f43f5e] to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-medium font-sans shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Google Dispatch Notification</span>
          </button>
          <a
            href={event.portalUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Open Target Source"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
