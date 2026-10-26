export type EventStatus = 'active' | 'checking' | 'shifted' | 'critical';

export interface MonitoredEvent {
  id: string;
  name: string;
  category: 'Hackathon' | 'Competition' | 'Grant / Innovation' | 'Open Source';
  organizer: string;
  portalUrl: string;
  officialDomain: string;
  currentDeadline: string; // ISO or readable date string
  originalDeadline: string;
  shifted: boolean;
  shiftDeltaDays?: number;
  shiftReason?: string;
  shiftDetectedAt?: string;
  status: EventStatus;
  lastChecked: string;
  lastStatusCode: number;
  pingLatencyMs: number;
  confidenceScore: number; // e.g. 99.4%
  trackedRules: {
    selector: string;
    schemaType: string;
    rssFeed?: string;
  };
  tags: string[];
  prizePool?: string;
  participantsCount?: string;
}

export interface DiscoveredPortal {
  id: string;
  name: string;
  category: 'Hackathon' | 'Competition' | 'Grant / Innovation' | 'Open Source';
  organizer: string;
  portalUrl: string;
  officialDomain: string;
  detectedDeadline: string;
  confidence: number;
  tags: string[];
  description: string;
  prizePool: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'success' | 'alert';
  eventId?: string;
  eventName?: string;
  message: string;
  statusCode?: number;
  latency?: number;
}

export interface SimulatedEmailData {
  isOpen: boolean;
  event: MonitoredEvent | null;
  previousDeadline: string;
  newDeadline: string;
  daysAdded: number;
  detectedAt: string;
  recipientEmail: string;
  recipientName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
  emailAlertsEnabled: boolean;
  webhookAlertsEnabled: boolean;
}
