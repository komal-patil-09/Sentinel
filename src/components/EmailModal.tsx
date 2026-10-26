import React from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { SimulatedEmailData } from '../types/sentinel';

interface EmailModalProps {
  data: SimulatedEmailData;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ data, onClose }) => {
  if (!data.isOpen || !data.event) return null;

  const { event, previousDeadline, newDeadline, daysAdded, recipientEmail, recipientName } = data;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Email Window Titlebar (Simulated macOS/Gmail style) */}
        <div className="bg-[#0b0f19] px-4 py-3 border-b border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-xs font-mono-tech text-slate-400">
              Google Workspace Notification Dispatcher
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Content Container */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#0e1422]">
          
          {/* Email Header */}
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              {/* Google / Firebase Branding */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span className="text-xs font-semibold text-slate-200">Google Cloud / Firebase Dispatcher</span>
                <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  DKIM Verified
                </span>
              </div>
              <span className="text-[11px] font-mono-tech text-slate-400">Just now</span>
            </div>

            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 w-16">Subject:</span>
                <span className="font-semibold text-white font-sans text-sm">
                  [SENTINEL ALERT] Deadline Extended: {event.name}
                </span>
              </div>
              <div className="flex items-baseline gap-2 font-mono-tech text-[11px]">
                <span className="text-slate-400 w-16">From:</span>
                <span className="text-slate-200">Sentinel Bot &lt;dispatcher@sentinel.google.internal&gt;</span>
              </div>
              <div className="flex items-baseline gap-2 font-mono-tech text-[11px]">
                <span className="text-slate-400 w-16">To:</span>
                <span className="text-[#fbbf24]">{recipientName} &lt;{recipientEmail}&gt;</span>
              </div>
            </div>
          </div>

          {/* Email Body Card */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-[#1f2937] space-y-4 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#f43f5e]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Automated Deadline Shift Detected
                </h3>
                <p className="text-xs text-slate-400">
                  Sentinel Crawler worker detected an official timeline amendment on target portal DOM.
                </p>
              </div>
            </div>

            {/* Shift Diff Visualization */}
            <div className="p-4 rounded-xl bg-[#0b0f19] border border-[#1f2937] space-y-2">
              <div className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Timeline Delta</span>
                <span className="text-[#fbbf24] font-bold">+{daysAdded} DAYS EXTENSION</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div>
                  <span className="text-[10px] uppercase font-mono-tech text-rose-400 block">Previous Cutoff</span>
                  <span className="text-sm font-mono-tech line-through text-rose-400/80 decoration-rose-500 decoration-2">
                    {formatDate(previousDeadline)}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                <div>
                  <span className="text-[10px] uppercase font-mono-tech text-amber-400 block">New Official Cutoff</span>
                  <span className="text-base font-bold font-mono-tech text-[#fbbf24]">
                    {formatDate(newDeadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Verification Details */}
            <div className="text-xs space-y-1.5 text-slate-400 font-mono-tech bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <span>Verified Source:</span>
                <a
                  href={event.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fbbf24] hover:underline flex items-center gap-1"
                >
                  <span>{event.officialDomain}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span>DOM XPath Selector:</span>
                <span className="text-slate-300">{event.trackedRules.selector}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cryptographic Digest:</span>
                <span className="text-slate-500 text-[10px]">SHA256: 9b2d8e4f1a...c7a2</span>
              </div>
            </div>

            {/* Action Buttons in Email */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => {
                  alert(`Synced new deadline (${formatDate(newDeadline)}) to Google Calendar for ${recipientEmail}!`);
                }}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#fbbf24] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Sync to Google Calendar</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium font-sans border border-slate-700 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Acknowledge Alert</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500 font-mono-tech">
            Sent by Sentinel Real-Time Watcher • Connected via Google Workspace & Firebase Cloud Messaging
          </p>

        </div>
      </div>
    </div>
  );
};
