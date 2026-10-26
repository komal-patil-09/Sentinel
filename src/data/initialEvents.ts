import type { MonitoredEvent, DiscoveredPortal } from '../types/sentinel';

export const INITIAL_EVENTS: MonitoredEvent[] = [
  {
    id: 'sih-2026',
    name: 'Smart India Hackathon 2026',
    category: 'Hackathon',
    organizer: 'Ministry of Education & AICTE',
    portalUrl: 'https://sih.gov.in/portal/announcements/round-1-deadline',
    officialDomain: 'sih.gov.in',
    currentDeadline: '2026-11-15T23:59:59+05:30',
    originalDeadline: '2026-10-31T23:59:59+05:30',
    shifted: false,
    status: 'active',
    lastChecked: '2 mins ago',
    lastStatusCode: 200,
    pingLatencyMs: 142,
    confidenceScore: 99.8,
    trackedRules: {
      selector: '.announcement-banner .date-badge',
      schemaType: 'CompetitionSchedule',
      rssFeed: 'https://sih.gov.in/feed/notices.xml'
    },
    tags: ['National', 'Hardware & Software', 'Govt of India'],
    prizePool: '₹1.5 Crore ($180K)',
    participantsCount: '65,000+ Teams'
  },
  {
    id: 'gsc-2026',
    name: 'Google Solution Challenge 2026',
    category: 'Hackathon',
    organizer: 'Google Developer Student Clubs (GDSC)',
    portalUrl: 'https://developers.google.com/community/gdsc-solution-challenge/timeline',
    officialDomain: 'developers.google.com',
    currentDeadline: '2026-11-20T18:00:00Z',
    originalDeadline: '2026-11-05T18:00:00Z',
    shifted: false,
    status: 'active',
    lastChecked: '4 mins ago',
    lastStatusCode: 200,
    pingLatencyMs: 88,
    confidenceScore: 99.4,
    trackedRules: {
      selector: 'section#timeline .submission-deadline',
      schemaType: 'EventTimeline',
      rssFeed: 'https://developers.google.com/feeds/gdsc.xml'
    },
    tags: ['Global', 'UN 17 Goals', 'Google Cloud', 'Android'],
    prizePool: '$100,000 + Mentorship',
    participantsCount: '12,000+ Builders'
  },
  {
    id: 'eth-2026',
    name: 'ETHGlobal Devcon 2026',
    category: 'Hackathon',
    organizer: 'ETHGlobal Foundation',
    portalUrl: 'https://ethglobal.com/events/devcon2026#apply',
    officialDomain: 'ethglobal.com',
    currentDeadline: '2026-11-10T23:59:00Z',
    originalDeadline: '2026-10-28T23:59:00Z',
    shifted: false,
    status: 'active',
    lastChecked: '1 min ago',
    lastStatusCode: 200,
    pingLatencyMs: 115,
    confidenceScore: 98.9,
    trackedRules: {
      selector: 'div[data-testid="deadline-countdown"]',
      schemaType: 'HackathonEvent'
    },
    tags: ['Web3', 'Ethereum', 'Smart Contracts', 'ZK'],
    prizePool: '$350,000 in Bounties',
    participantsCount: '2,500 Hackers'
  },
  {
    id: 'nasa-spaceapps-2026',
    name: 'NASA Space Apps Challenge 2026',
    category: 'Competition',
    organizer: 'NASA Earth Science Division',
    portalUrl: 'https://www.spaceappschallenge.org/2026/challenges/',
    officialDomain: 'spaceappschallenge.org',
    currentDeadline: '2026-11-28T23:59:59Z',
    originalDeadline: '2026-11-15T23:59:59Z',
    shifted: false,
    status: 'active',
    lastChecked: '5 mins ago',
    lastStatusCode: 200,
    pingLatencyMs: 165,
    confidenceScore: 99.1,
    trackedRules: {
      selector: '.challenge-header .due-date-val',
      schemaType: 'SpaceAppDeadline'
    },
    tags: ['Open Science', 'Space Tech', 'AI/Satellite Data'],
    prizePool: 'Global Honor & NASA Launch Visit',
    participantsCount: '80,000+ Global Participants'
  },
  {
    id: 'hackmit-2026',
    name: 'HackMIT 2026',
    category: 'Hackathon',
    organizer: 'MIT TechX',
    portalUrl: 'https://hackmit.org/apply/guidelines',
    officialDomain: 'hackmit.org',
    currentDeadline: '2026-11-08T23:59:00-04:00',
    originalDeadline: '2026-10-25T23:59:00-04:00',
    shifted: false,
    status: 'active',
    lastChecked: '8 mins ago',
    lastStatusCode: 200,
    pingLatencyMs: 95,
    confidenceScore: 97.6,
    trackedRules: {
      selector: '#apply-section .deadline-timestamp',
      schemaType: 'EventRegistration'
    },
    tags: ['Collegiate', 'Cambridge, MA', 'Hardware Track'],
    prizePool: '$50,000+',
    participantsCount: '1,000+ In-Person'
  }
];

export const DISCOVERED_PORTALS_CATALOG: DiscoveredPortal[] = [
  {
    id: 'sih-2026-catalog',
    name: 'Smart India Hackathon 2026 (SIH)',
    category: 'Hackathon',
    organizer: 'Govt. of India & AICTE',
    portalUrl: 'https://sih.gov.in/portal/announcements/round-1-deadline',
    officialDomain: 'sih.gov.in',
    detectedDeadline: '2026-11-15T23:59:59+05:30',
    confidence: 99.8,
    tags: ['Hardware', 'Software', 'Government'],
    description: 'World’s biggest open innovation model connecting 10M+ student problem solvers.',
    prizePool: '₹1.5 Crore ($180K)'
  },
  {
    id: 'gsc-2026-catalog',
    name: 'Google Solution Challenge 2026',
    category: 'Hackathon',
    organizer: 'Google Developer Student Clubs',
    portalUrl: 'https://developers.google.com/community/gdsc-solution-challenge/timeline',
    officialDomain: 'developers.google.com',
    detectedDeadline: '2026-11-20T18:00:00Z',
    confidence: 99.4,
    tags: ['Google Cloud', 'Flutter', 'AI', 'Global'],
    description: 'Solve one of the United Nations 17 Sustainable Development Goals using Google tech.',
    prizePool: '$100,000 + Google Mentorship'
  },
  {
    id: 'openai-builders-2026',
    name: 'OpenAI Frontier AI Hackathon 2026',
    category: 'Hackathon',
    organizer: 'OpenAI Developer Relations',
    portalUrl: 'https://openai.com/hackathons/frontier-builders-2026',
    officialDomain: 'openai.com',
    detectedDeadline: '2026-12-05T23:59:00Z',
    confidence: 98.7,
    tags: ['Generative AI', 'Agents', 'API Credits'],
    description: 'Build autonomous agentic workflows and next-generation reasoning systems.',
    prizePool: '$250,000 in compute & funding'
  },
  {
    id: 'imagine-cup-2027',
    name: 'Microsoft Imagine Cup 2027',
    category: 'Competition',
    organizer: 'Microsoft Learn Student Ambassadors',
    portalUrl: 'https://imaginecup.microsoft.com/en-us/competition/timeline',
    officialDomain: 'imaginecup.microsoft.com',
    detectedDeadline: '2026-12-18T23:59:59Z',
    confidence: 99.0,
    tags: ['Azure AI', 'Startups', 'Global Showcase'],
    description: 'Global student tech competition that empowers student founders to bring dreams to life.',
    prizePool: '$100,000 + CEO Mentorship'
  },
  {
    id: 'calhacks-12',
    name: 'CalHacks 12.0 (UC Berkeley)',
    category: 'Hackathon',
    organizer: 'Cal Hacks Fellowship',
    portalUrl: 'https://calhacks.io/apply/fall2026',
    officialDomain: 'calhacks.io',
    detectedDeadline: '2026-11-12T23:59:00-08:00',
    confidence: 96.5,
    tags: ['San Francisco', 'World’s Largest Collegiate', 'Y Combinator'],
    description: 'World’s largest collegiate hackathon hosted at San Francisco Palace of Fine Arts.',
    prizePool: '$120,000'
  },
  {
    id: 'icpc-world-finals-2026',
    name: 'ICPC World Finals Regional Qualifiers',
    category: 'Competition',
    organizer: 'International Collegiate Programming Contest',
    portalUrl: 'https://icpc.global/regionals/2026/registration',
    officialDomain: 'icpc.global',
    detectedDeadline: '2026-12-01T23:59:00Z',
    confidence: 99.5,
    tags: ['Algorithms', 'Data Structures', 'Competitive Coding'],
    description: 'The premier global university programming competition.',
    prizePool: 'Gold Medals & Global Prestige'
  }
];
