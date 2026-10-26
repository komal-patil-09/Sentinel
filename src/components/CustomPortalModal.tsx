import React, { useState } from 'react';
import { X, Sparkles, Globe, Calendar, Tag } from 'lucide-react';
import type { MonitoredEvent } from '../types/sentinel';
import { sound } from '../utils/soundEffects';

interface CustomPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (newEvent: MonitoredEvent) => void;
}

export const CustomPortalModal: React.FC<CustomPortalModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [name, setName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [portalUrl, setPortalUrl] = useState('');
  const [category, setCategory] = useState<'Hackathon' | 'Competition' | 'Grant / Innovation' | 'Open Source'>('Hackathon');
  const [deadline, setDeadline] = useState('2026-11-30T23:59');
  const [tagInput, setTagInput] = useState('Web3, AI, Cloud');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let domain = 'custom-portal.org';
    try {
      if (portalUrl) {
        const u = new URL(portalUrl.startsWith('http') ? portalUrl : `https://${portalUrl}`);
        domain = u.hostname;
      }
    } catch {
      domain = 'custom-target.dev';
    }

    const newEvent: MonitoredEvent = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      organizer: organizer.trim() || 'Official Committee',
      portalUrl: portalUrl.trim() || `https://${domain}/schedule`,
      officialDomain: domain,
      currentDeadline: new Date(deadline).toISOString(),
      originalDeadline: new Date(deadline).toISOString(),
      shifted: false,
      status: 'active',
      lastChecked: 'Just now',
      lastStatusCode: 200,
      pingLatencyMs: Math.floor(Math.random() * 80) + 70,
      confidenceScore: 99.1,
      trackedRules: {
        selector: '.event-header .submission-cutoff',
        schemaType: 'CustomCompetitionSchema',
      },
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      prizePool: 'TBD',
      participantsCount: 'New Sentinel Watch'
    };

    sound.playVerified();
    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111827] border border-[#1f2937] rounded-2xl shadow-2xl overflow-hidden">
        {/* Titlebar */}
        <div className="bg-[#0b0f19] px-5 py-4 border-b border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            <h3 className="text-sm font-bold text-white font-sans">
              Add Custom Target to Sentinel Watchlist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Event / Competition Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. TreeHacks 2026, MIT Climate Hackathon"
              className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white focus:border-[#fbbf24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Organizer / Host
              </label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. Stanford ACM"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white focus:border-[#fbbf24] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white focus:border-[#fbbf24] focus:outline-none"
              >
                <option value="Hackathon">Hackathon</option>
                <option value="Competition">Competition</option>
                <option value="Grant / Innovation">Grant / Innovation</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Target Portal URL
            </label>
            <input
              type="url"
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              placeholder="https://treehacks.com/schedule"
              className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white font-mono-tech focus:border-[#fbbf24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Initial Tracked Deadline (Date & Time)
            </label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white font-mono-tech focus:border-[#fbbf24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Collegiate, Global, AI"
              className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-white focus:border-[#fbbf24] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#1f2937] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f43f5e] to-rose-600 hover:from-rose-500 hover:to-rose-600 text-white font-semibold transition-all active:scale-95 shadow-lg shadow-rose-950/50"
            >
              Add to Sentinel Watch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
