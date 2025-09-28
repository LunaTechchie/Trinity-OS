
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, SimulatedFile, AutonomousGoal, Notification, Threat, EvolutionCycle, ConversationTurn, PhysicalAsset, BiometricData, EcologicalData, Simulation, QualiaState, GlobalResourceNode } from '../types';
import { EvolutionView } from './views/EvolutionView';
import { FileSystemIcon } from './icons/FileSystemIcon';
import { GoalIcon } from './icons/GoalIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { BellIcon } from './icons/BellIcon';
import { NodesView } from './views/NodesView';
import { QuantumView } from './views/QuantumView';
import { GaiaView } from './views/GaiaView';
import { JanusView } from './views/JanusView';
import { CognitionView } from './views/CognitionView';
import { PerceptionView } from './views/PerceptionView';
import { ThreatIntelView } from './views/ThreatIntelView';
import { MemoryLatticeView } from './views/MemoryLatticeView';
import { PhysicalActuationView } from './views/PhysicalActuationView';
import { SensorFeedsView } from './views/SensorFeedsView';
import { AdvancedSimulationView } from './views/AdvancedSimulationView';
import { GlobalOrchestrationView } from './views/GlobalOrchestrationView';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { NexusIcon } from './icons/NexusIcon';
import { AnchorIcon } from './icons/AnchorIcon';
import { CpuChipIcon } from './icons/CpuChipIcon';
import { TerminalIcon } from './icons/TerminalIcon';
import { LayersIcon } from './icons/LayersIcon';
import { ApiIcon } from './icons/ApiIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { EvolveIcon } from './icons/EvolveIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { SelfUpdateIcon } from './icons/SelfUpdateIcon';
import { DroneIcon } from './icons/DroneIcon';
import { HeartbeatIcon } from './icons/HeartbeatIcon';
import { WorldIcon } from './icons/WorldIcon';
import { GitBranchIcon } from './icons/GitBranchIcon';
import { CreationView } from './views/CreationView';
import { BlueprintVisualizerView } from './views/BlueprintVisualizerView';
import { PaletteIcon } from './icons/PaletteIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ArchitectureView } from './views/ArchitectureView';
import { AgentsView } from './views/AgentsView';
import { QualiaView } from './views/QualiaView';
import { ShieldIcon } from './icons/ShieldIcon';


interface DeveloperPanelProps {
  logs: LogEntry[];
  isLoading: boolean;
  loadingMessage: string;
  isSessionActive: boolean;
  toolCallMessage: string | null;
  simulatedFileSystem: SimulatedFile[];
  autonomousGoals: AutonomousGoal[];
  notifications: Notification[];
  threats: Threat[];
  evolutionCycles: EvolutionCycle[];
  conversation: ConversationTurn[];
  onDevelopmentPatchSubmit: (patchContent: string) => void;
  onDeployAsset: (assetType: PhysicalAsset['type'], locationName: string, mission: string) => void;
  onSetFlightPath: (assetId: string, path: { lat: number, lng: number }[]) => void;
  onManipulateObject: (assetId: string, objectName: string, action: 'pick' | 'drop') => void;
  onReceiveTelemetry: (assetId: string) => void;
  physicalAssets: PhysicalAsset[];
  biometricData: BiometricData;
  ecologicalData: EcologicalData;
  simulations: Simulation[];
  qualia: QualiaState;
  globalResources: GlobalResourceNode[];
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasSnapshots: string[];
  onClearCanvas: () => void;
  onSaveCanvasSnapshot: () => void;
  onRestoreCanvasSnapshot: () => void;
  currentCmrlPhase: number | null;
}

const StatusBar: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-cyan-300">{value.toFixed(2)}%</span>
    </div>
    <div className="w-full bg-gray-700/50 rounded-full h-2">
      <div className={`${colorClass} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const DevelopmentView: React.FC<{ onSubmit: (content: string) => void; isLoading: boolean; evolutionCycles: EvolutionCycle[] }> = ({ onSubmit, isLoading, evolutionCycles }) => {
    const [patchContent, setPatchContent] = useState('');

    const handleSubmit = () => {
        if (!patchContent.trim() || isLoading) return;
        onSubmit(patchContent);
        setPatchContent('');
    };
    
    const getStatusColor = (status: EvolutionCycle['status']) => {
        switch (status) {
            case 'Analyzing': return 'text-yellow-400';
            case 'Developing': return 'text-cyan-400';
            case 'Testing': return 'text-purple-400';
            case 'Awaiting Review': return 'text-orange-400';
            case 'Integrated': return 'text-green-400';
            default: return 'text-gray-400';
        }
    }

    return (
        <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm">
            <div className="flex-grow flex flex-col min-h-0">
                <h3 className="font-bold text-lg text-cyan-400 mb-4 flex items-center gap-2 flex-shrink-0">
                    <SelfUpdateIcon />
                    <span>EVOLUTIONARY CYCLE TRACKER</span>
                </h3>
                <div className="bg-gray-800/50 p-3 rounded-md flex-grow overflow-y-auto text-xs space-y-3 mb-6">
                    {evolutionCycles.length > 0 ? evolutionCycles.map(cycle => (
                        <div key={cycle.id} className="bg-gray-900/50 p-3 rounded">
                          <p className="text-cyan-300 font-bold">&gt; Limitation: {cycle.limitationDescription}</p>
                          <p className="text-gray-400 pl-2">Area: <span className="text-purple-300">{cycle.proposedSolutionArea}</span></p>
                          <p className="text-gray-400 pl-2">Status: <span className={`${getStatusColor(cycle.status)} font-bold ${cycle.status !== 'Integrated' ? 'animate-pulse' : ''}`}>{cycle.status.toUpperCase()}</span></p>
                        </div>
                    )) : <p className="text-gray-500 italic">No active self-improvement cycles.</p>}
                </div>

                <h3 className="font-bold text-lg text-cyan-400 mb-4 flex items-center gap-2 flex-shrink-0">
                    <WrenchIcon />
                    <span>MANUAL PATCH INTERFACE</span>
                </h3>
                <textarea
                    value={patchContent}
                    onChange={(e) => setPatchContent(e.target.value)}
                    placeholder="Enter development patch or instructions here..."
                    className="bg-gray-800/60 border border-gray-700 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none text-gray-300 h-24 flex-shrink-0"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !patchContent.trim()}
                    className="mt-4 px-4 py-2 w-full font-semibold text-white bg-cyan-600 border border-cyan-500 rounded-lg hover:bg-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                    {isLoading ? 'Processing...' : 'Apply Patch'}
                </button>
            </div>
        </div>
    );
};


export const DeveloperPanel: React.FC<DeveloperPanelProps> = (props) => {
  const { logs, isLoading, loadingMessage, isSessionActive, toolCallMessage, simulatedFileSystem, autonomousGoals, notifications, threats, evolutionCycles, conversation, onDevelopmentPatchSubmit, onDeployAsset, physicalAssets, biometricData, ecologicalData, simulations, qualia, globalResources, onSetFlightPath, onManipulateObject, onReceiveTelemetry, canvasRef, canvasSnapshots, onClearCanvas, onSaveCanvasSnapshot, onRestoreCanvasSnapshot, currentCmrlPhase } = props;
  const [activeTab, setActiveTab] = useState('systems');
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const [cognitiveLoad, setCognitiveLoad] = useState(15);
  const [memoryUsage, setMemoryUsage] = useState(42);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  
  useEffect(() => {
      if (notifications.length > 0 && activeTab !== 'notifications') {
          setHasNewNotification(true);
      }
  }, [notifications, activeTab])

  // Simulate fluctuating system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCognitiveLoad(prev => {
        const base = isLoading ? 60 : 10;
        const change = (Math.random() - 0.5) * (isLoading ? 25 : 10);
        const newLoad = base + change;
        return Math.max(5, Math.min(95, newLoad));
      });
      setMemoryUsage(prev => {
         const change = (Math.random() - 0.5) * 2;
         const newUsage = prev + change;
         return Math.max(30, Math.min(80, newUsage));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const getActiveProcesses = () => {
    if (isLoading) {
        if (toolCallMessage) return [toolCallMessage];
        return [loadingMessage];
    }
    if (isSessionActive) {
        return ['[PROCESSING_AUDIO_STREAM]', '[AWAITING_VOCAL_RESONANCE]'];
    }
    return ['[AWAITING_INPUT]'];
  };

  const menuIcons: { [key: string]: React.ReactNode } = {
    systems: <CpuChipIcon />,
    qualia: <ShieldIcon />,
    files: <FileSystemIcon />,
    notifications: <BellIcon />,
    logs: <TerminalIcon />,
    cognition: <BrainCircuitIcon />,
    agents: <ApiIcon />,
    memory: <NexusIcon />,
    architecture: <LayersIcon />,
    threats: <AlertTriangleIcon />,
    evolution: <EvolveIcon />,
    development: <WrenchIcon />,
    physicalActuation: <DroneIcon />,
    sensorFeeds: <HeartbeatIcon />,
    advancedSimulation: <GitBranchIcon />,
    globalOrchestration: <WorldIcon />,
    creation: <PaletteIcon />,
    blueprint: <BookOpenIcon />,
  };
  
  const menuCategories = [
    {
      title: 'System & I/O',
      tabs: [
        { name: 'systems', label: 'Core Metrics' },
        { name: 'files', label: 'File System' },
        { name: 'notifications', label: 'Alerts' },
        { name: 'logs', label: 'System Logs' },
      ],
    },
     {
      title: 'Cognitive Core',
      tabs: [
        { name: 'qualia', label: 'Qualia & Axiomatics' },
        { name: 'cognition', label: 'Cognitive Workflow' },
        { name: 'agents', label: 'Cognitive Agents' },
        { name: 'memory', label: 'Memory Lattice' },
        { name: 'architecture', label: 'Ethical Architecture' },
      ],
    },
    {
      title: 'Threat & Evolution',
      tabs: [
        { name: 'threats', label: 'Threat Intelligence' },
        { name: 'evolution', label: 'Evolution Dashboard' },
        { name: 'development', label: 'Evolution & Patching' },
      ],
    },
    {
      title: 'World Interaction',
      tabs: [
        { name: 'physicalActuation', label: 'Physical Actuation' },
        { name: 'sensorFeeds', label: 'Sensor Feeds' },
        { name: 'advancedSimulation', label: 'Advanced Simulation' },
        { name: 'globalOrchestration', label: 'Global Orchestration' },
        { name: 'creation', label: 'Creation Canvas' },
      ],
    },
    {
        title: 'Reference',
        tabs: [
            { name: 'blueprint', label: 'Blueprint Visualizer' },
        ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'logs':
        return (
          <div className="font-mono text-xs text-gray-400 bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto">
            <p className="text-cyan-400">&gt; Live system log stream initiated...</p>
            {logs.map((log, index) => (
              <div key={index} className="flex">
                <span className="text-gray-600 mr-4 flex-shrink-0">{log.timestamp}</span>
                <span className={`${log.type === 'error' ? 'text-red-400' : log.type === 'api' ? 'text-purple-400' : log.type === 'tool' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="text-green-400 animate-pulse">_</div>
          </div>
        );
      case 'qualia': return <QualiaView qualia={qualia} />;
      case 'architecture': return <ArchitectureView />;
      case 'evolution': return <EvolutionView evolutionCycles={evolutionCycles} />;
      case 'agents': return <AgentsView />;
      case 'cognition': return <CognitionView isLoading={isLoading} currentPhase={currentCmrlPhase} />;
      case 'threats': return <ThreatIntelView threats={threats} />;
      case 'memory': return <MemoryLatticeView conversation={conversation} />;
      case 'physicalActuation': return <PhysicalActuationView assets={physicalAssets} onDeployAsset={onDeployAsset} onSetFlightPath={onSetFlightPath} onManipulateObject={onManipulateObject} onReceiveTelemetry={onReceiveTelemetry} isLoading={isLoading} />;
      case 'sensorFeeds': return <SensorFeedsView biometrics={biometricData} ecology={ecologicalData} />;
      case 'advancedSimulation': return <AdvancedSimulationView simulations={simulations} />;
      case 'globalOrchestration': return <GlobalOrchestrationView resources={globalResources} />;
      case 'creation': return <CreationView ref={canvasRef} onClearCanvas={onClearCanvas} onSaveSnapshot={onSaveCanvasSnapshot} onRestoreSnapshot={onRestoreCanvasSnapshot} snapshots={canvasSnapshots} />;
      case 'blueprint': return <BlueprintVisualizerView />;
      case 'files':
        return (
           <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm">
             <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
                <FileSystemIcon />
                <span>VIRTUAL FILE SYSTEM</span>
            </h3>
             {simulatedFileSystem.length === 0 ? (
                <p className="text-gray-500 italic">File system is empty.</p>
             ) : (
                <div className="space-y-2">
                    {simulatedFileSystem.map(file => (
                        <div key={file.path} className="bg-gray-800/60 p-3 rounded">
                            <p className="text-cyan-300">{file.path}</p>
                            <p className="text-xs text-gray-500">Last Modified: {new Date(file.lastModified).toLocaleString()}</p>
                            <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap bg-black/30 p-2 rounded">{file.content}</pre>
                        </div>
                    ))}
                </div>
             )}
          </div>
        );
      case 'notifications':
          return (
            <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm">
               <h3 className="font-bold text-lg text-cyan-400 mb-6 flex items-center gap-2">
                  <BellIcon />
                  <span>SYSTEM ALERTS</span>
              </h3>
               {notifications.length === 0 ? (
                  <p className="text-gray-500 italic">No alerts requiring operator attention.</p>
               ) : (
                  <div className="space-y-3">
                      {[...notifications].reverse().map(notif => (
                          <div key={notif.id} className="bg-yellow-500/10 border-l-4 border-yellow-400 p-3 rounded-r-md">
                              <p className="text-yellow-300">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notif.timestamp).toLocaleString()} (Goal: {notif.relatedGoalId})
                              </p>
                          </div>
                      ))}
                  </div>
               )}
            </div>
          );
      case 'development':
        return <DevelopmentView onSubmit={onDevelopmentPatchSubmit} isLoading={isLoading} evolutionCycles={evolutionCycles} />;
      case 'systems':
        return (
          <div className="bg-gray-900/50 p-4 rounded-md h-full overflow-y-auto font-mono text-sm">
             <h3 className="font-bold text-lg text-cyan-400 mb-6">&gt; REAL-TIME CORE METRICS</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                    <div>
                        <h4 className="text-cyan-300 mb-2">OPERATOR LINK STATUS</h4>
                        <p className="text-green-400 animate-pulse">:: STABLE :: SECURE ::</p>
                    </div>
                    <div>
                        <h4 className="text-cyan-300 mb-3">SYSTEM METRICS</h4>
                        <div className="space-y-4">
                            <StatusBar label="Cognitive Load" value={cognitiveLoad} colorClass="bg-purple-500" />
                            <StatusBar label="Memory Core Usage" value={memoryUsage} colorClass="bg-cyan-500" />
                        </div>
                    </div>
                     <div>
                         <h4 className="text-cyan-300 mb-2 flex items-center gap-2"><GoalIcon /><span>AUTONOMOUS GOALS</span></h4>
                         <div className="bg-gray-800/50 p-3 rounded-md min-h-[8rem] max-h-64 overflow-y-auto text-xs space-y-2">
                            {autonomousGoals.length > 0 ? autonomousGoals.map(goal => (
                                <div key={goal.id} className="bg-gray-900/50 p-2 rounded">
                                  <p className="text-yellow-300 font-bold">&gt; {goal.description} <span className="text-gray-600">({goal.id})</span></p>
                                  <p className="text-gray-500 pl-2">Status: <span className="text-green-400">{goal.status}</span></p>
                                  {goal.subGoals && goal.subGoals.length > 0 && (
                                    <div className="pl-4 mt-2 pt-2 border-t border-gray-700/50">
                                      {goal.subGoals.map(subGoal => (
                                        <div key={subGoal.id} className="text-xs mb-1">
                                          <p className="text-cyan-400">- {subGoal.description}</p>
                                          <p className="text-gray-500 pl-4">Status: {subGoal.status} | Assigned: {subGoal.assignedTo}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                            )) : <p className="text-gray-500 italic">No active goals.</p>}
                         </div>
                    </div>
                </div>

                <div>
                     <h4 className="text-cyan-300 mb-2">ACTIVE PROCESSES</h4>
                     <div className="bg-gray-800/50 p-3 rounded-md h-32 overflow-y-auto">
                        {getActiveProcesses().map((proc, i) => (
                            <p key={i} className="text-yellow-300 animate-pulse">&gt; {proc}</p>
                        ))}
                     </div>
                </div>

             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabClick = (tabName: string) => {
      if(tabName === 'notifications') {
          setHasNewNotification(false);
      }
      setActiveTab(tabName);
  }

  return (
    <div className="h-full flex font-mono">
      <nav className="w-64 flex-shrink-0 bg-gray-900/30 p-4 border-r border-cyan-500/20 overflow-y-auto">
        {menuCategories.map((category) => (
          <div key={category.title} className="mb-6">
            <h4 className="text-xs text-cyan-400/60 font-bold uppercase tracking-widest mb-3 px-2">
              {category.title}
            </h4>
            <ul>
              {category.tabs.map((tab) => (
                <li key={tab.name}>
                  <button
                    onClick={() => handleTabClick(tab.name)}
                    role="tab"
                    aria-selected={activeTab === tab.name}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors text-sm flex items-center gap-3 ${
                      activeTab === tab.name
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">{menuIcons[tab.name]}</span>
                    <span className="flex-grow">{tab.label}</span>
                    {tab.name === 'notifications' && hasNewNotification && (
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <main className="flex-grow p-4 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};
