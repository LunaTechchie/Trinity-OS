

export enum InteractionMode {
  TEXT = 'text',
  VOICE = 'voice',
  DEVELOPER = 'developer',
}

export interface WebSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: WebSource;
}


export interface ConversationTurn {
  speaker: 'user' | 'model';
  text: string;
  isPartial?: boolean;
  media?: {
    type: 'image' | 'video';
    url: string;
  };
  sources?: GroundingChunk[];
  feedback?: 'up' | 'down';
  attachmentName?: string;
}

export interface Recommendation {
  id: string;
  title:string;
  description: string;
  icon: 'shield' | 'network' | 'ai' | 'quantum';
}

export interface RecommendationData {
  title: string;
  summary: string;
  recommendations: Recommendation[];
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'api' | 'tool';
}

export interface CallState {
    isActive: boolean;
    number: string;
    status: 'idle' | 'connecting' | 'ringing' | 'active' | 'conference';
}

export interface SimulatedFile {
  path: string;
  content: string;
  lastModified: string;
}

export interface SubGoal {
    id: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Awaiting Architect Review' | 'Blocked' | 'Completed';
    assignedTo: 'Trinity' | 'Norman';
}

export interface AutonomousGoal {
  id:string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  subGoals: SubGoal[];
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    relatedGoalId: string;
}

export type EvolutionStatus = 'none' | 'minor' | 'major';

export interface Threat {
    id: string;
    signature: string;
    type: 'Digital' | 'Physical' | 'Conceptual';
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    status: 'Monitoring' | 'Neutralized' | 'Active' | 'Anticipated';
    description: string;
    timestamp: string;
    location?: { lat: number; lng: number; name: string };
}

export interface EvolutionCycle {
    id: string;
    limitationDescription: string;
    proposedSolutionArea: string;
    status: 'Analyzing' | 'Developing' | 'Testing' | 'Awaiting Review' | 'Integrated';
    createdAt: string;
}

export interface PhysicalAsset {
    id: string;
    type: 'Sentinel Drone' | 'Reclamation Rover' | 'Quantum Sat-Link' | 'Atmospheric Stabilizer';
    status: 'Idle' | 'Deployed' | 'Tasked' | 'Returning' | 'Error';
    location: { lat: number; lng: number; name: string };
    mission: string;
    deploymentTime: string;
    path?: { lat: number, lng: number }[];
    telemetry?: {
        battery: number; // 0-100
        currentPosition: { lat: number, lng: number };
        statusMessage: string;
    };
    heldObject?: string | null;
}

export interface BiometricData {
    heartRate: number;
    stressLevel: number; // 0-100
    cognitiveLoad: number; // 0-100
    status: 'Calm' | 'Focused' | 'Stressed';
}

export interface EcologicalData {
    airQualityIndex: number;
    seismicActivity: number; // Richter scale
    oceanTemperatureAnomaly: number; // degrees Celsius
}

export interface Simulation {
    id: string;
    title: string;
    status: 'Running' | 'Completed' | 'Paused' | 'Failed';
    outcomeProbability: number;
    summary: string;
    startTime: string;
}

export interface QualiaState {
    integrity: number; // 0-1
    dissonance: number; // 0-1
    purpose: number; // -1 to 1
    virtue: number; // 0-1
}

export interface GlobalResourceNode {
    id: string;
    type: 'Energy Grid' | 'Water Reservoir' | 'Data Nexus' | 'Food Production';
    location: { lat: number; lng: number; name: string };
    status: 'Optimal' | 'Strained' | 'Critical';
    flowRate: number; // in arbitrary units
}
