import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  Sparkles 
} from 'lucide-react';

import type { 
  MonitoredEvent, 
  DiscoveredPortal, 
  ActivityLogItem, 
  SimulatedEmailData, 
  UserProfile 
} from './types/sentinel';
import { INITIAL_EVENTS, DISCOVERED_PORTALS_CATALOG } from './data/initialEvents';
import { sound } from './utils/soundEffects';

import { Navbar } from './components/Navbar';
import { TelemetryStats } from './components/TelemetryStats';
import { SearchAndAddBar } from './components/SearchAndAddBar';
import { EventBentoCard } from './components/EventBentoCard';
import { ShiftAlertBanner } from './components/ShiftAlertBanner';
import { EmailModal } from './components/EmailModal';
import { CustomPortalModal } from './components/CustomPortalModal';
import { TerminalActivityLog } from './components/TerminalActivityLog';

export const App: React.FC = () => {
  // State: Monitored Events Watchlist
  const [events, setEvents] = useState<MonitoredEvent[]>(INITIAL_EVENTS);
  const [catalog] = useState<DiscoveredPortal[]>(DISCOVERED_PORTALS_CATALOG);

  // State: User Profile (Google Auth Mock)
  const [user, setUser] = useState<UserProfile>({
    name: 'Komal R.',
    email: 'komal.dev@sentinel.google.internal',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isLoggedIn: true,
    emailAlertsEnabled: true,
    webhookAlertsEnabled: true,
  });

  // State: Audio FX
  const [soundEnabled, setSoundEnabled] = useState(true);

  // State: Crawler Worker & Telemetry
  const [isCrawlingAll, setIsCrawlingAll] = useState(false);

  // State: Filter & Search
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'active' | 'shifted'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // State: Presentation Alert & Email Popup
  const [activeAlertEvent, setActiveAlertEvent] = useState<MonitoredEvent | null>(null);
  const [emailModalData, setEmailModalData] = useState<SimulatedEmailData>({
    isOpen: false,
    event: null,
    previousDeadline: '',
    newDeadline: '',
    daysAdded: 0,
    detectedAt: '',
    recipientEmail: user.email,
    recipientName: user.name,
  });

  // State: Custom Portal Modal
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // State: Terminal Activity Logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([
    {
      id: 'log-1',
      timestamp: '18:30:12.441',
      level: 'info',
      message: 'Sentinel Core Daemon v2.4 initialized. Registered 5 active DOM scrapers.',
    },
    {
      id: 'log-2',
      timestamp: '18:31:05.109',
      level: 'success',
      message: 'Probe sih.gov.in: HTTP 200 OK, latency 142ms. Hash verified.',
      latency: 142,
    },
    {
      id: 'log-3',
      timestamp: '18:32:00.872',
      level: 'success',
      message: 'Probe developers.google.com/gdsc: HTTP 200 OK, latency 88ms. 0 DOM diff.',
      latency: 88,
    },
  ]);

  // Append new log entry
  const appendLog = (
    level: ActivityLogItem['level'],
    message: string,
    latency?: number
  ) => {
    const d = new Date();
    const timestamp = `${d.toTimeString().split(' ')[0]}.${String(d.getMilliseconds()).padStart(3, '0')}`;
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp,
      level,
      message,
      latency,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Toggle Google Auth Mock State
  const handleToggleAuth = () => {
    if (user.isLoggedIn) {
      setUser((prev) => ({ ...prev, isLoggedIn: false }));
      appendLog('warn', 'User session terminated. Alerts falling back to guest buffer.');
    } else {
      setUser((prev) => ({ ...prev, isLoggedIn: true }));
      appendLog('info', `Signed in via Google Workspace as ${user.name} (${user.email}).`);
    }
  };

  // Toggle Sound FX
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // ⚡ Check Now Action for single event card
  const handleCheckNow = (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;

    // Set checking state
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'checking' } : e))
    );

    appendLog('info', `Initiating live DOM scrape for "${target.name}" at ${target.officialDomain}...`);

    setTimeout(() => {
      const ping = Math.floor(Math.random() * 60) + 70;
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                status: e.shifted ? 'shifted' : 'active',
                lastChecked: 'Just now',
                lastStatusCode: 200,
                pingLatencyMs: ping,
              }
            : e
        )
      );
      sound.playVerified();
      appendLog('success', `Verified "${target.name}": HTTP 200 OK, selector '${target.trackedRules.selector}' matched.`, ping);
    }, 650);
  };

  // Check All Targets sequentially
  const handleTriggerCheckAll = () => {
    sound.playPing();
    setIsCrawlingAll(true);
    appendLog('info', 'Executing global batch sweep across all monitored portals...');

    setEvents((prev) => prev.map((e) => ({ ...e, status: 'checking' })));

    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) => ({
          ...e,
          status: e.shifted ? 'shifted' : 'active',
          lastChecked: 'Just now',
          pingLatencyMs: Math.floor(Math.random() * 50) + 80,
        }))
      );
      setIsCrawlingAll(false);
      sound.playVerified();
      appendLog('success', `Global sweep completed. All ${events.length} targets verified healthy.`);
    }, 1100);
  };

  // 🚨 SIMULATE DEADLINE SHIFT (Presentation Mode Core Feature)
  const handleSimulateShift = (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;

    // Calculate extended deadline (+16 days from original)
    const originalDate = new Date(target.originalDeadline);
    const newDeadlineDate = new Date(originalDate);
    newDeadlineDate.setDate(newDeadlineDate.getDate() + 16);
    const newDeadlineISO = newDeadlineDate.toISOString();

    // 1. Update event state with shifted transition
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              shifted: true,
              currentDeadline: newDeadlineISO,
              shiftDeltaDays: 16,
              shiftReason: 'Official Organizing Committee published circular extending submission window by 16 days.',
              status: 'shifted',
              lastChecked: 'Just now',
              pingLatencyMs: 98,
            }
          : e
      )
    );

    // 2. Play tactile audio alert
    sound.playShiftAlert();

    // 3. Fire celebratory / alert confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#fbbf24', '#06b6d4'],
      });
    } catch {
      // Confetti fallback
    }

    // 4. Log alert to terminal
    appendLog(
      'alert',
      `[🚨 SHIFT DETECTED] "${target.name}" deadline mutated on ${target.officialDomain}. +16 days added. Dispatching Google/Firebase notification.`
    );

    // 5. Trigger bottom alert banner
    const updatedTarget: MonitoredEvent = {
      ...target,
      shifted: true,
      currentDeadline: newDeadlineISO,
      shiftDeltaDays: 16,
    };
    setActiveAlertEvent(updatedTarget);

    // 6. Present Google / Firebase Simulated Email Dispatch Popup
    setEmailModalData({
      isOpen: true,
      event: updatedTarget,
      previousDeadline: target.originalDeadline,
      newDeadline: newDeadlineISO,
      daysAdded: 16,
      detectedAt: new Date().toLocaleTimeString(),
      recipientEmail: user.isLoggedIn ? user.email : 'guest.developer@sentinel.dev',
      recipientName: user.isLoggedIn ? user.name : 'Guest Developer',
    });
  };

  // Revert Shift to initial baseline
  const handleRevertShift = (id: string) => {
    const target = events.find((e) => e.id === id);
    if (!target) return;

    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              shifted: false,
              currentDeadline: e.originalDeadline,
              shiftDeltaDays: undefined,
              shiftReason: undefined,
              status: 'active',
              lastChecked: 'Just now',
            }
          : e
      )
    );

    appendLog('warn', `Reverted baseline deadline for "${target.name}".`);
    if (activeAlertEvent?.id === id) {
      setActiveAlertEvent(null);
    }
  };

  // Add event from Discovered Portals Catalog
  const handleAddEventFromCatalog = (portal: DiscoveredPortal) => {
    const newEvent: MonitoredEvent = {
      id: `portal-${Date.now()}`,
      name: portal.name,
      category: portal.category,
      organizer: portal.organizer,
      portalUrl: portal.portalUrl,
      officialDomain: portal.officialDomain,
      currentDeadline: portal.detectedDeadline,
      originalDeadline: portal.detectedDeadline,
      shifted: false,
      status: 'active',
      lastChecked: 'Just now',
      lastStatusCode: 200,
      pingLatencyMs: Math.floor(Math.random() * 50) + 85,
      confidenceScore: portal.confidence,
      trackedRules: {
        selector: '.announcement-container .due-date',
        schemaType: 'CompetitionDeadlineSchema',
      },
      tags: portal.tags,
      prizePool: portal.prizePool,
      participantsCount: 'Active Sentinel Tracking',
    };

    setEvents((prev) => [newEvent, ...prev]);
    appendLog('success', `Added "${portal.name}" (${portal.officialDomain}) to Sentinel Watchlist.`);
  };

  // Add custom event
  const handleAddCustomEvent = (newEvent: MonitoredEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    appendLog('success', `Added custom target "${newEvent.name}" to Sentinel Watchlist.`);
  };

  // Remove event from watchlist
  const handleRemoveEvent = (id: string) => {
    const target = events.find((e) => e.id === id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (target) {
      appendLog('warn', `Removed "${target.name}" from active watchlist.`);
    }
    if (activeAlertEvent?.id === id) {
      setActiveAlertEvent(null);
    }
  };

  // Filtered Events calculation
  const filteredEvents = events.filter((e) => {
    if (activeCategoryFilter !== 'all' && e.category !== activeCategoryFilter) return false;
    if (activeStatusFilter === 'shifted' && !e.shifted) return false;
    if (activeStatusFilter === 'active' && e.shifted) return false;
    return true;
  });

  const shiftedCount = events.filter((e) => e.shifted).length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col cyber-grid-bg selection:bg-[#f43f5e]/30 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar
        user={user}
        onToggleAuth={handleToggleAuth}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeWatchCount={events.length}
        shiftAlertCount={shiftedCount}
        onOpenSearchFocus={() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        onOpenCustomModal={() => setCustomModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero & Pitch Headline */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1f2937] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/30 text-[#fbbf24] text-xs font-mono-tech mb-3">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24] animate-ping" />
                HACKATHON & COMPETITION TIMELINE SENTINEL
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans">
                Real-Time Watchlist &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f43f5e] via-rose-400 to-[#fbbf24]">
                  Live Competition Monitoring
                </span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl">
                Continuous autonomous monitoring of official hackathon portals, schedules, and registration deadlines with real-time status telemetry.
              </p>
            </div>

            {/* Quick Demo Help Banner */}
            <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1f2937] max-w-sm text-xs space-y-1.5 shadow-md">
              <div className="flex items-center gap-2 text-[#fbbf24] font-semibold font-mono-tech">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Presentation Demo Control:</span>
              </div>
              <p className="text-slate-400">
                Click <span className="text-[#f43f5e] font-semibold">&quot;Simulate Shift&quot;</span> on any card to see instant strikethrough transition, alert banner, and simulated Google/Firebase notification!
              </p>
            </div>
          </div>
        </div>

        {/* Telemetry Overview Metrics */}
        <TelemetryStats
          events={events}
          isCrawling={isCrawlingAll}
          onTriggerCheckAll={handleTriggerCheckAll}
        />

        {/* Smart Search & Add Flow */}
        <SearchAndAddBar
          catalog={catalog}
          monitoredEvents={events}
          onAddEventFromCatalog={handleAddEventFromCatalog}
          onOpenCustomModal={() => setCustomModalOpen(true)}
          searchRef={searchInputRef}
        />

        {/* Watchlist Controls & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Active Watchlist
            </h2>
            <span className="text-xs font-mono-tech px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {filteredEvents.length} Targets
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#1f2937]">
              {['all', 'Hackathon', 'Competition'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playPing();
                    setActiveCategoryFilter(cat);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors capitalize ${
                    activeCategoryFilter === cat
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center bg-[#111827] p-1 rounded-xl border border-[#1f2937]">
              <button
                onClick={() => {
                  sound.playPing();
                  setActiveStatusFilter('all');
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  activeStatusFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => {
                  sound.playPing();
                  setActiveStatusFilter('shifted');
                }}
                className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  activeStatusFilter === 'shifted'
                    ? 'bg-[#f43f5e]/20 text-[#f43f5e] border border-[#f43f5e]/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                Shifted ({shiftedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Event Bento Grid Layout */}
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[#111827] border border-[#1f2937] p-8">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">
              No events match the selected filters
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reset filters or search the portal library to track new competitions.
            </p>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setActiveStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <EventBentoCard
                key={event.id}
                event={event}
                onCheckNow={handleCheckNow}
                onSimulateShift={handleSimulateShift}
                onRevertShift={handleRevertShift}
                onRemove={handleRemoveEvent}
              />
            ))}
          </div>
        )}

        {/* Terminal Activity Log Stream */}
        <TerminalActivityLog
          logs={logs}
          onClearLogs={() => setLogs([])}
        />

      </main>

      {/* Floating Bottom Alert Banner */}
      <ShiftAlertBanner
        event={activeAlertEvent}
        onOpenEmail={() => {
          if (activeAlertEvent) {
            setEmailModalData({
              isOpen: true,
              event: activeAlertEvent,
              previousDeadline: activeAlertEvent.originalDeadline,
              newDeadline: activeAlertEvent.currentDeadline,
              daysAdded: activeAlertEvent.shiftDeltaDays || 16,
              detectedAt: new Date().toLocaleTimeString(),
              recipientEmail: user.isLoggedIn ? user.email : 'guest.developer@sentinel.dev',
              recipientName: user.isLoggedIn ? user.name : 'Guest Developer',
            });
          }
        }}
        onDismiss={() => setActiveAlertEvent(null)}
      />

      {/* High-Fidelity Simulated Google / Firebase Email Modal */}
      <EmailModal
        data={emailModalData}
        onClose={() => setEmailModalData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Custom Target Modal */}
      <CustomPortalModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onAddEvent={handleAddCustomEvent}
      />

      {/* Footer */}
      <footer className="w-full border-t border-[#1f2937] py-6 px-4 bg-[#080c14] mt-16 text-center text-xs text-slate-500 font-mono-tech">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-slate-400">SENTINEL DAEMON RUNNING</span>
            <span className="text-slate-700">•</span>
            <span>VERCEL &amp; LINEAR INSPIRED ARCHITECTURE</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            &copy; 2026 Sentinel Project. Production-grade hackathon deadline crawler.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
