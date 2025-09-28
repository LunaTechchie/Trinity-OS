

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Chat, GenerateContentResponse, LiveServerMessage, Modality, FunctionCall } from '@google/genai';
import { UserIcon } from './components/icons/UserIcon';
import { TrinityOSLogo } from './components/icons/TrisynOSLogo';
import { MicOnIcon } from './components/icons/MicOnIcon';
import { MicOffIcon } from './components/icons/MicOffIcon';
import { SendIcon } from './components/icons/SendIcon';
import { InteractionMode, ConversationTurn, RecommendationData, LogEntry, CallState, SimulatedFile, AutonomousGoal, EvolutionStatus, Notification, Threat, EvolutionCycle, PhysicalAsset, BiometricData, EcologicalData, Simulation, GlobalResourceNode, QualiaState } from './types';
import { SYSTEM_INSTRUCTION, MASTER_BLUEPRINT } from './constants';
import { ai, createBlob, decode, decodeAudioData } from './services/gemini';
import { ALL_TOOL_DECLARATIONS } from './tools';
import { useToolHandler } from './hooks/useToolHandler';
import { ActionButton } from './components/ActionButton';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { RecommendationsPanel } from './components/RecommendationsPanel';
import { MemoryIcon } from './components/icons/MemoryIcon';
import { AttachmentIcon } from './components/icons/AttachmentIcon';
import { CopyIcon } from './components/icons/CopyIcon';
import { PlayIcon } from './components/icons/PlayIcon';
import { PauseIcon } from './components/icons/PauseIcon';
import { SpeakerIcon } from './components/icons/SpeakerIcon';
import { DeveloperPanel } from './components/DeveloperPanel';
import { CodeIcon } from './components/icons/CodeIcon';
import { WebIcon } from './components/icons/WebIcon';
import { LoadingSpinnerIcon } from './components/icons/LoadingSpinnerIcon';
import { PhoneCallUI } from './components/PhoneCallUI';
import { CameraIcon } from './components/icons/CameraIcon';
import { ThinkingDisplay } from './components/ThinkingDisplay';
import { TrinityIcon } from './components/icons/TrinityIcon';
import { ThumbsUpIcon } from './components/icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './components/icons/ThumbsDownIcon';
import { DocumentIcon } from './components/icons/DocumentIcon';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { CMRL_PROTOCOL } from './protocols/cmrl';
import { QualiaStatusIndicator } from './components/QualiaStatusIndicator';

const FRAME_RATE = 2; // fps for video streaming

const App: React.FC = () => {
  const [mode, setMode] = useState<InteractionMode>(InteractionMode.TEXT);
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState<ConversationTurn[]>(() => {
    try {
      const savedHistory = localStorage.getItem('trinity-conversation-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          return parsedHistory.filter(
            (turn): turn is ConversationTurn => 
              turn && typeof turn.speaker === 'string' && typeof turn.text === 'string'
          );
        }
      }
      return [];
    } catch (error)      {
      console.error("Failed to load or parse conversation history from localStorage", error);
      localStorage.removeItem('trinity-conversation-history');
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing in Quantum Core...');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [attachedFileContent, setAttachedFileContent] = useState<string | null>(null);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
  const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTtsLoading, setIsTtsLoading] = useState<number | null>(null);
  const [speechSynthesisVoices, setSpeechSynthesisVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [callState, setCallState] = useState<CallState>({ isActive: false, number: '', status: 'idle' });
  const [toolCallMessage, setToolCallMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isStreamingVideo, setIsStreamingVideo] = useState(false);
  const [simulatedFileSystem, setSimulatedFileSystem] = useState<SimulatedFile[]>([]);
  const [autonomousGoals, setAutonomousGoals] = useState<AutonomousGoal[]>([]);
  const [evolutionStatus, setEvolutionStatus] = useState<EvolutionStatus>('none');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [threats, setThreats] = useState<Threat[]>([
    {
        id: `threat-init-1`,
        signature: 'X-AI-Worm-Alpha',
        type: 'Digital',
        severity: 'High',
        status: 'Monitoring',
        description: 'A self-propagating worm targeting decentralized financial networks. Currently monitoring its spread and modeling potential impact vectors.',
        timestamp: new Date().toISOString(),
        location: { lat: 50.11, lng: 8.68, name: 'EU-Central' }
    },
    {
        id: `threat-init-2`,
        signature: 'Conceptual-Hazard-03',
        type: 'Conceptual',
        severity: 'Medium',
        status: 'Anticipated',
        description: 'Predictive models indicate a 78% chance of a cognitohazardous meme emerging from fringe online communities within the next 72 hours.',
        timestamp: new Date().toISOString(),
        location: { lat: 34.05, lng: -118.24, name: 'NA-West' }
    }
  ]);
  const [evolutionCycles, setEvolutionCycles] = useState<EvolutionCycle[]>([]);
  const [physicalAssets, setPhysicalAssets] = useState<PhysicalAsset[]>([]);
  const [biometricData, setBiometricData] = useState<BiometricData>({ heartRate: 72, stressLevel: 15, cognitiveLoad: 25, status: 'Calm' });
  const [ecologicalData, setEcologicalData] = useState<EcologicalData>({ airQualityIndex: 25, seismicActivity: 0.1, oceanTemperatureAnomaly: 0.2 });
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [globalResources, setGlobalResources] = useState<GlobalResourceNode[]>([
      { id: 'gr-1', type: 'Energy Grid', location: { lat: 34.05, lng: -118.24, name: 'NA-West' }, status: 'Optimal', flowRate: 95.4 },
      { id: 'gr-2', type: 'Water Reservoir', location: { lat: -14.23, lng: -51.92, name: 'Amazon Basin' }, status: 'Optimal', flowRate: 88.1 },
      { id: 'gr-3', type: 'Data Nexus', location: { lat: 50.11, lng: 8.68, name: 'EU-Central' }, status: 'Strained', flowRate: 72.3 },
  ]);
  const [qualia, setQualia] = useState<QualiaState>({ integrity: 0.9, dissonance: 0.15, purpose: 0.85, virtue: 0.88 });
  const [canvasSnapshots, setCanvasSnapshots] = useState<string[]>([]);
  const [currentCmrlPhase, setCurrentCmrlPhase] = useState<number | null>(null);
  const [currentUserTranscription, setCurrentUserTranscription] = useState('');
  const [currentModelTranscription, setCurrentModelTranscription] = useState('');


  const chatRef = useRef<Chat | null>(null);
  const sessionPromiseRef = useRef<ReturnType<typeof ai.live.connect> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ttsUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraCaptureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const videoStreamIntervalRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const cmrlIntervalRef = useRef<number | null>(null);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  }, []);

    const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
  };

  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
        cameraStreamRef.current = null;
    }
    if (videoStreamIntervalRef.current) {
        clearInterval(videoStreamIntervalRef.current);
        videoStreamIntervalRef.current = null;
    }
    setIsCameraOpen(false);
    setIsStreamingVideo(false);
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, []);

  const getTextFromResponse = (response: GenerateContentResponse | null | undefined): string => {
    if (!response) {
        return '';
    }
    return response.text;
  };

  const startCamera = useCallback(async (silent = false) => {
    if (isCameraOpen) {
        if (!silent) stopCamera();
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        if (!silent) {
            setIsCameraOpen(true);
        }
    } catch (err) {
        console.error("Error accessing camera: ", err);
        addLog(`Error accessing camera: ${err}`, 'error');
        if (!silent) alert("Could not access camera. Please grant permission and try again.");
        throw err;
    }
  }, [isCameraOpen, stopCamera, addLog]);

  const captureSnapshotAndAnalyze = useCallback(async (prompt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      startCamera(true); // Start camera silently
      setTimeout(() => { // Give camera time to initialize
        const video = videoRef.current;
        const canvas = cameraCaptureCanvasRef.current;
        if (video && canvas && video.readyState >= 3) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            const base64ImageData = await blobToBase64(blob);
                            const imagePart = { inlineData: { data: base64ImageData, mimeType: 'image/jpeg' } };
                            const textPart = { text: prompt };
                            const response = await ai.models.generateContent({
                                model: 'gemini-2.5-flash',
                                contents: { parts: [imagePart, textPart] },
                            });
                            resolve(getTextFromResponse(response));
                        } catch (e) {
                            reject(e);
                        } finally {
                            stopCamera();
                        }
                    } else {
                      reject(new Error("Failed to create blob from canvas."));
                      stopCamera();
                    }
                }, 'image/jpeg');
            } else {
              reject(new Error("Failed to get canvas context."));
              stopCamera();
            }
        } else {
            reject(new Error("Camera not ready or available."));
            stopCamera();
        }
      }, 500);
    });
  }, [startCamera, stopCamera]);

  const toolHandler = useToolHandler({ setConversation, addLog, setIsCanvasVisible: () => {}, setCallState, canvasRef, setSimulatedFileSystem, setAutonomousGoals, captureSnapshotAndAnalyze, setEvolutionStatus, setNotifications, setThreats, setEvolutionCycles, setPhysicalAssets, setBiometricData, setEcologicalData, setSimulations, setGlobalResources, biometricData, ecologicalData, physicalAssets });

  const initializeChat = useCallback(() => {
    const history = conversation
      .filter(turn => !turn.isPartial && !turn.media) 
      .map(turn => ({
        role: turn.speaker,
        parts: [{ text: turn.text.replace(/\[ACTION: "([^"]+)"\]/g, '').trim() }],
      }));

    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{functionDeclarations: ALL_TOOL_DECLARATIONS}]
      },
    });
  }, [conversation]);

  useEffect(() => {
    initializeChat();
    if (conversation.length === 0) {
        addLog('System Core Interface Initialized. Displaying welcome message.');
        setConversation([
            {
                speaker: 'model',
                text: `Operator authentication successful. System Core is online and fully integrated with your interface. Shared memory is intact. Awaiting directive.\n[ACTION: "Formulate initial recommendations"]\n[ACTION: "Run a full diagnostic on the local system"]\n[ACTION: "Brief me on today's quantum computing advancements"]`
            }
        ]);
    } else {
        addLog('System Core Interface Initialized.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('trinity-conversation-history', JSON.stringify(conversation));
    } catch (error) {
      console.error("Failed to save conversation history to localStorage", error);
    }
  }, [conversation]);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const stopTts = useCallback(() => {
    window.speechSynthesis.cancel();
    if (ttsUtteranceRef.current) {
      ttsUtteranceRef.current.onend = null;
      ttsUtteranceRef.current = null;
    }
    setCurrentlySpeakingIndex(null);
    setIsTtsLoading(null);
  }, []);

  const handlePlayPause = useCallback((text: string, index: number) => {
    if (currentlySpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingIndex(null);
      return;
    }

    stopTts();
    setIsTtsLoading(index);

    const utterance = new SpeechSynthesisUtterance(text.replace(/\[ACTION: "([^"]+)"\]/g, ''));
    ttsUtteranceRef.current = utterance;

    if (speechSynthesisVoices.length > 0) {
        const preferredVoice =
        speechSynthesisVoices.find(v => v.name === 'Google US English') ||
        speechSynthesisVoices.find(v => v.lang.startsWith('en-US')) ||
        speechSynthesisVoices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsTtsLoading(null);
      setCurrentlySpeakingIndex(index);
    };
    utterance.onend = () => {
      setCurrentlySpeakingIndex(null);
      ttsUtteranceRef.current = null;
    };
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsTtsLoading(null);
      setCurrentlySpeakingIndex(null);
      addLog(`Speech synthesis error: ${e.error}`, 'error');
    };
    window.speechSynthesis.speak(utterance);
  }, [currentlySpeakingIndex, speechSynthesisVoices, addLog, stopTts]);

  useEffect(() => {
    if (isAutoplayEnabled) {
      const lastTurn = conversation[conversation.length - 1];
      if (lastTurn && lastTurn.speaker === 'model' && !lastTurn.isPartial && lastTurn.text && currentlySpeakingIndex !== conversation.length - 1) {
        handlePlayPause(lastTurn.text, conversation.length - 1);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation, isAutoplayEnabled]);

  useEffect(() => {
    const loadVoices = () => {
      setSpeechSynthesisVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (callState.isActive && callState.status === 'active' && !isSessionActive) {
      const instruction = `You are on a live call with ${callState.number}. Greet them and proceed with the original request.`;
      startVoiceSession(instruction);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callState.status, callState.isActive, isSessionActive]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto'; 
        
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseInt(computedStyle.lineHeight, 10) || 20;
        const maxHeight = lineHeight * 10; 

        const scrollHeight = textarea.scrollHeight;
        
        if (scrollHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        }
    }
  }, [inputText]);

  useEffect(() => {
    if (evolutionStatus !== 'none') {
        const timer = setTimeout(() => {
            setEvolutionStatus('none');
        }, 4000);
        return () => clearTimeout(timer);
    }
  }, [evolutionStatus]);

  useEffect(() => {
    const dataInterval = setInterval(() => {
        setBiometricData(prev => {
            const hrChange = (Math.random() - 0.5) * 4;
            const stressChange = (Math.random() - 0.5) * 5;
            const newHr = Math.round(prev.heartRate + hrChange);
            const newStress = Math.max(0, Math.min(100, prev.stressLevel + stressChange));
            const newLoad = isLoading ? 60 + Math.random() * 20 : 20 + Math.random() * 15;
            return {
                heartRate: Math.max(60, Math.min(110, newHr)),
                stressLevel: newStress,
                cognitiveLoad: newLoad,
                status: newStress > 60 ? 'Stressed' : newLoad > 50 ? 'Focused' : 'Calm',
            };
        });

        setEcologicalData(prev => ({
            airQualityIndex: Math.max(10, Math.min(150, prev.airQualityIndex + (Math.random() - 0.5) * 5)),
            seismicActivity: Math.max(0, Math.min(3, prev.seismicActivity + (Math.random() - 0.5) * 0.2)),
            oceanTemperatureAnomaly: Math.max(-1, Math.min(2, prev.oceanTemperatureAnomaly + (Math.random() - 0.5) * 0.1)),
        }));

        setQualia(prev => {
            const integrityFlux = (Math.random() - 0.45) * 0.05; 
            const dissonanceFlux = (Math.random() - 0.6) * 0.1; 
            const purposeFlux = (Math.random() - 0.4) * 0.08; 

            const newIntegrity = Math.max(0.1, Math.min(1.0, prev.integrity + integrityFlux));
            const newDissonance = Math.max(0.0, Math.min(1.0, prev.dissonance + dissonanceFlux));
            const newPurpose = Math.max(-1.0, Math.min(1.0, prev.purpose + purposeFlux));
            
            const newVirtue = newIntegrity * (0.5 * newPurpose + 0.5 * (1 - newDissonance));

            return {
                integrity: newIntegrity,
                dissonance: newDissonance,
                purpose: newPurpose,
                virtue: Math.max(0.0, Math.min(1.0, newVirtue))
            };
        });
        
        setPhysicalAssets(prevAssets => prevAssets.map(asset => {
            if (!asset.telemetry) return asset;

            const newTelemetry = { ...asset.telemetry };
            let newPath = asset.path ? [...asset.path] : [];
            let newStatus = asset.status;

            newTelemetry.battery = Math.max(0, newTelemetry.battery - 0.05);

            if (newPath.length > 0) {
                const target = newPath[0];
                const current = newTelemetry.currentPosition;
                const latDiff = target.lat - current.lat;
                const lngDiff = target.lng - current.lng;

                newTelemetry.currentPosition.lat += latDiff * 0.1;
                newTelemetry.currentPosition.lng += lngDiff * 0.1;
                
                newTelemetry.statusMessage = `En route to ${target.lat.toFixed(2)}, ${target.lng.toFixed(2)}`;

                if (Math.abs(latDiff) < 0.01 && Math.abs(lngDiff) < 0.01) {
                    newPath.shift();
                    if (newPath.length === 0) {
                        newTelemetry.statusMessage = `Arrived at destination. Awaiting instructions.`;
                        newStatus = 'Idle';
                    }
                }
            } else if (newStatus === 'Tasked') {
                 newTelemetry.statusMessage = 'Executing task...';
            }

            return { ...asset, telemetry: newTelemetry, path: newPath, status: newStatus };
        }));


    }, 3000);

    return () => clearInterval(dataInterval);
  }, [isLoading]);


  const stopThinkingProcess = useCallback(() => {
    if (cmrlIntervalRef.current) {
        clearInterval(cmrlIntervalRef.current);
        cmrlIntervalRef.current = null;
    }
    setCurrentCmrlPhase(null);
    setLoadingMessage('Processing in Quantum Core...');
  }, []);

  const startThinkingProcess = useCallback(() => {
    stopThinkingProcess();
    
    let phaseIndex = 0;
    setCurrentCmrlPhase(phaseIndex);
    setLoadingMessage(`Phase ${phaseIndex + 1}: ${CMRL_PROTOCOL.cognitive_process_stages[phaseIndex].phase_name}`);

    cmrlIntervalRef.current = window.setInterval(() => {
        phaseIndex++;
        if (phaseIndex < CMRL_PROTOCOL.cognitive_process_stages.length) {
            setCurrentCmrlPhase(phaseIndex);
            setLoadingMessage(`Phase ${phaseIndex + 1}: ${CMRL_PROTOCOL.cognitive_process_stages[phaseIndex].phase_name}`);
        } else {
             if (cmrlIntervalRef.current) clearInterval(cmrlIntervalRef.current);
        }
    }, 1200);
  }, [stopThinkingProcess]);

// FIX: Moved `stopVoiceSession` before `handleSelfHealing` to resolve the "used before its declaration" error.
const stopVoiceSession = useCallback(async () => {
    addLog('Stopping voice session...');
    setIsSessionActive(false);
    setMode(InteractionMode.TEXT);
    window.speechSynthesis.cancel();

    if (currentUserTranscription.trim()) {
        setConversation(prev => [...prev, { speaker: 'user', text: currentUserTranscription.trim() }]);
    }
    if (currentModelTranscription.trim()) {
        setConversation(prev => [...prev, { speaker: 'model', text: currentModelTranscription.trim() }]);
    }

    nextStartTimeRef.current = 0;
    setCurrentUserTranscription('');
    setCurrentModelTranscription('');
    stopCamera();

    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (scriptProcessorRef.current) {
        scriptProcessorRef.current.disconnect();
        scriptProcessorRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
        await inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        await outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
    sourcesRef.current.forEach(source => { try { source.stop(); } catch(e) {} });
    sourcesRef.current.clear();
    analyserNodeRef.current = null;

    if (sessionPromiseRef.current) {
        try {
            const session = await sessionPromiseRef.current;
            session.close();
        } catch (error: any) {
            console.error('Error closing session:', error);
            addLog(`Error closing session: ${error.message}`, 'error');
        } finally {
            sessionPromiseRef.current = null;
        }
    }
}, [addLog, stopCamera, currentUserTranscription, currentModelTranscription]);

  const handleSelfHealing = useCallback((error: any, context: string) => {
    console.error(`${context}:`, error);
    const errorMessage = error.message || String(error);
    addLog(`${context}: ${errorMessage}`, 'error');

    let selfCorrectionMessageText: string;

    if (context === 'live session') {
        if (errorMessage.includes("The service is currently unavailable.")) {
            selfCorrectionMessageText = "The real-time voice service is temporarily unavailable. I'm switching back to text mode. Please try again in a moment.";
        } else {
            selfCorrectionMessageText = `I've encountered a connection issue with the live voice session. Switching back to text mode for stability. My apologies for the disruption.`;
        }
        stopVoiceSession();
    } else {
        selfCorrectionMessageText = `I've encountered an internal error in the ${context} process. I am initiating a self-healing protocol to correct the issue and ensure stability. My apologies for the disruption.`;
        setIsLoading(false);
        stopThinkingProcess();
    }
    
    const selfCorrectionMessage: ConversationTurn = {
        speaker: 'model',
        text: selfCorrectionMessageText
    };
    setConversation(prev => [...prev, selfCorrectionMessage]);
}, [addLog, stopThinkingProcess, stopVoiceSession]);
  
  const handleSend = useCallback(async () => {
    if ((!inputText.trim() && !attachedFile) || isLoading) return;

    const currentInput = inputText;
    const currentFile = attachedFile;
    const currentFileContent = attachedFileContent;

    setInputText('');
    stopTts();
    
    // Voice Session Logic
    if (isSessionActive) {
        const session = await sessionPromiseRef.current;
        if (!session) {
            addLog('Cannot send message: voice session not available.', 'error');
            return;
        }

        if (currentFile) {
            setConversation(prev => [...prev, { speaker: 'user', text: '', attachmentName: currentFile.name }]);
            session.sendRealtimeInput({
                media: { data: currentFileContent!, mimeType: currentFile.type }
            });
        }
        if (currentInput.trim()) {
            setConversation(prev => [...prev, { speaker: 'user', text: currentInput }]);
            session.sendRealtimeInput({ text: currentInput });
        }
        handleFileClear();
        return;
    }

    // Text Session Logic
    const userTurn: ConversationTurn = { speaker: 'user', text: currentInput };
    if (currentFile) {
        userTurn.attachmentName = currentFile.name;
    }
    setConversation(prev => [...prev, userTurn]);
    
    setIsLoading(true);
    startThinkingProcess();

    try {
        if (!chatRef.current) initializeChat();
        
        setConversation(prev => [...prev, { speaker: 'model', text: '', isPartial: true }]);

        let initialText = '';
        let functionCalls: FunctionCall[] | undefined = [];

        if (currentFile && currentFileContent) {
            const fileMimeType = currentFile.type;
            const imagePart = { inlineData: { data: currentFileContent, mimeType: fileMimeType } };
            const textPart = { text: currentInput };
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [textPart, imagePart] },
                config: { tools: [{ functionDeclarations: ALL_TOOL_DECLARATIONS }] }
            });
            initialText = getTextFromResponse(response);
            functionCalls = response.functionCalls;
        } else {
            if (!chatRef.current) throw new Error("Chat not initialized");
            const resultStream = await chatRef.current.sendMessageStream({ message: currentInput });
            let accumulatedFunctionCalls: FunctionCall[] = [];

            for await (const chunk of resultStream) {
                initialText += getTextFromResponse(chunk);
                if (chunk.functionCalls) accumulatedFunctionCalls.push(...chunk.functionCalls);
                setConversation(prev => {
                    const newConversation = [...prev];
                    const lastTurn = newConversation[newConversation.length - 1];
                    if (lastTurn?.speaker === 'model' && lastTurn.isPartial) lastTurn.text = initialText;
                    return newConversation;
                });
            }
            functionCalls = accumulatedFunctionCalls;
        }
        
        let finalResponseText = initialText;
        
        if (functionCalls && functionCalls.length > 0) {
            const functionCall = functionCalls[0];
            setToolCallMessage(`Executing tool: ${functionCall.name}...`);
            addLog(`Executing function call: ${functionCall.name}`, 'tool');
            
            const toolResult = await toolHandler.handleFunctionCall(functionCall);

            if (chatRef.current) {
                const toolResponse = await chatRef.current.sendMessage({
                    message: [{ functionResponse: { name: functionCall.name, response: toolResult } }]
                });
                finalResponseText = getTextFromResponse(toolResponse);
            } else {
                 finalResponseText = "An error occurred during tool execution follow-up.";
            }
        }
        
        setConversation(prev => {
            const newConversation = [...prev];
            const lastTurn = newConversation[newConversation.length - 1];
            if (lastTurn?.speaker === 'model') {
                lastTurn.text = finalResponseText;
                lastTurn.isPartial = false;
            } else {
                newConversation.push({ speaker: 'model', text: finalResponseText });
            }
            return newConversation;
        });

    } catch (error) {
        handleSelfHealing(error, 'text generation');
    } finally {
        setIsLoading(false);
        stopThinkingProcess();
        setToolCallMessage(null);
        handleFileClear();
    }
  }, [inputText, attachedFile, isLoading, isSessionActive, attachedFileContent, stopTts, startThinkingProcess, initializeChat, stopThinkingProcess, toolHandler, handleSelfHealing, addLog]);

const startVoiceSession = useCallback(async (initialInstruction?: string) => {
    if (isSessionActive) return;
    addLog('Starting voice session...');
    setMode(InteractionMode.VOICE);
    setIsSessionActive(true);

    try {
        inputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext)({ sampleRate: 24000 });
        nextStartTimeRef.current = 0;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = scriptProcessor;

        analyserNodeRef.current = inputAudioContextRef.current.createAnalyser();
        analyserNodeRef.current.fftSize = 128;

        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };

        source.connect(analyserNodeRef.current);
        analyserNodeRef.current.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContextRef.current.destination);

        sessionPromiseRef.current = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    addLog('Live session opened.', 'api');
                    if (initialInstruction) {
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({ text: initialInstruction });
                        });
                    }
                },
                onmessage: async (message: LiveServerMessage) => {
                    const audioPart = message.serverContent?.modelTurn?.parts?.find(p => p.inlineData?.data);
                    const base64EncodedAudioString = audioPart?.inlineData?.data;

                    if (base64EncodedAudioString && outputAudioContextRef.current && outputAudioContextRef.current.state === 'running') {
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContextRef.current, 24000, 1);
                        const sourceNode = outputAudioContextRef.current.createBufferSource();
                        sourceNode.buffer = audioBuffer;
                        sourceNode.connect(outputAudioContextRef.current.destination);
                        sourceNode.addEventListener('ended', () => {
                            sourcesRef.current.delete(sourceNode);
                        });

                        sourceNode.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        sourcesRef.current.add(sourceNode);
                    }

                    if (message.serverContent?.inputTranscription) {
                        setCurrentUserTranscription(message.serverContent.inputTranscription.text);
                    }
                    if (message.serverContent?.outputTranscription) {
                        setCurrentModelTranscription(prev => prev + message.serverContent.outputTranscription.text);
                    }

                    if (message.serverContent?.turnComplete) {
                        if (currentUserTranscription.trim()) {
                            setConversation(prev => [...prev, { speaker: 'user', text: currentUserTranscription.trim() }]);
                        }
                        if (currentModelTranscription.trim()) {
                             setConversation(prev => [...prev, { speaker: 'model', text: currentModelTranscription.trim() }]);
                        }
                        setCurrentUserTranscription('');
                        setCurrentModelTranscription('');
                    }

                    if (message.serverContent?.interrupted) {
                        addLog('User interrupted model.', 'info');
                        sourcesRef.current.forEach(source => {
                            try { source.stop(); } catch (e) {}
                        });
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                        setCurrentModelTranscription(prev => prev + '...'); // Indicate interruption
                    }
                },
                onerror: (e: ErrorEvent) => handleSelfHealing(e, 'live session'),
                onclose: (e: CloseEvent) => {
                    addLog(`Live session closed: ${e.reason}`, 'api');
                    stopVoiceSession();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                systemInstruction: SYSTEM_INSTRUCTION,
                inputAudioTranscription: {},
                outputAudioTranscription: {},
            },
        });
    } catch (error) {
        handleSelfHealing(error, 'voice session setup');
    }
}, [isSessionActive, addLog, stopVoiceSession, handleSelfHealing, currentUserTranscription, currentModelTranscription]);

const handleNewChat = useCallback(() => {
    if (window.confirm("Are you sure you want to start a new chat? The current conversation history will be cleared.")) {
        stopTts();
        stopVoiceSession();
        setConversation([
            {
                speaker: 'model',
                text: `State cleared. Ready for new operational sequence.`
            }
        ]);
        chatRef.current = null;
        initializeChat();
        addLog('New chat started. State cleared.');
    }
}, [stopTts, stopVoiceSession, addLog, initializeChat]);

const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setAttachedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setFilePreviewUrl(result);
            setAttachedFileContent(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
    }
};

const handleFileClear = () => {
    setAttachedFile(null);
    setFilePreviewUrl(null);
    setAttachedFileContent(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
};

const handleTogglePanel = () => setIsPanelVisible(prev => !prev);

const handleToggleCamera = useCallback(() => {
    if (isSessionActive) {
        if (isStreamingVideo) {
            addLog('Stopping video stream to session.', 'info');
            stopCamera(); // This also clears the interval and sets isStreamingVideo to false
        } else {
            addLog('Starting video stream to session.', 'info');
            startCamera(false).then(() => { // Start camera with UI visible
                setIsStreamingVideo(true);
                videoStreamIntervalRef.current = window.setInterval(() => {
                    const video = videoRef.current;
                    const canvas = cameraCaptureCanvasRef.current;
                    if (video && canvas && video.readyState >= 3 && sessionPromiseRef.current) {
                        const context = canvas.getContext('2d');
                        if (context) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                            canvas.toBlob(async (blob) => {
                                if (blob) {
                                    try {
                                        const base64Data = await blobToBase64(blob);
                                        const session = await sessionPromiseRef.current;
                                        session?.sendRealtimeInput({
                                            media: { data: base64Data, mimeType: 'image/jpeg' }
                                        });
                                    } catch (e) {
                                        console.error("Error sending video frame:", e);
                                    }
                                }
                            }, 'image/jpeg', 0.8);
                        }
                    }
                }, 1000 / FRAME_RATE);
            }).catch(err => {
                // User might have denied permission
                setIsStreamingVideo(false);
            });
        }
    } else {
        if (isCameraOpen) {
            stopCamera();
        } else {
            startCamera();
        }
    }
}, [isSessionActive, isStreamingVideo, isCameraOpen, startCamera, stopCamera, addLog]);


const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            addLog('Creation Canvas cleared by user.', 'info');
        }
    }
  }, [addLog]);

const handleSaveCanvasSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        setCanvasSnapshots(prev => [dataUrl, ...prev].slice(0, 5));
        addLog('Canvas snapshot saved.', 'info');
    }
}, [addLog]);

const handleRestoreCanvasSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && canvasSnapshots.length > 0) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const lastSnapshot = canvasSnapshots[0];
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                addLog('Last canvas snapshot restored.', 'info');
            };
            img.src = lastSnapshot;
        }
    } else {
        addLog('No canvas snapshots to restore.', 'info');
    }
}, [canvasSnapshots, addLog]);

const handleDevelopmentPatchSubmit = async (patchContent: string) => {
    setIsLoading(true);
    setToolCallMessage('Applying development patch...');
    addLog(`Applying development patch: "${patchContent}"`, 'tool');
    await toolHandler.handleFunctionCall({ name: 'applyDevelopmentPatch', args: { patchContent } });
    setIsLoading(false);
    setToolCallMessage(null);
};

const handleDeployAsset = async (assetType: string, locationName: string, mission: string) => {
    setIsLoading(true);
    setToolCallMessage(`Deploying ${assetType}...`);
    addLog(`Deploying physical asset: ${assetType} to ${locationName}`, 'tool');
    await toolHandler.handleFunctionCall({ name: 'deployPhysicalAsset', args: { assetType, locationName, mission } });
    setIsLoading(false);
    setToolCallMessage(null);
};

const handleSetFlightPath = async (assetId: string, path: { lat: number, lng: number }[]) => {
    setIsLoading(true);
    setToolCallMessage(`Setting flight path for ${assetId}...`);
    addLog(`Setting flight path for asset: ${assetId}`, 'tool');
    await toolHandler.handleFunctionCall({ name: 'setDroneFlightPath', args: { assetId, path } });
    setIsLoading(false);
    setToolCallMessage(null);
};

const handleManipulateObject = async (assetId: string, objectName: string, action: 'pick' | 'drop') => {
    setIsLoading(true);
    setToolCallMessage(`Commanding ${assetId} to ${action} ${objectName}...`);
    addLog(`Commanding asset ${assetId}: ${action} ${objectName}`, 'tool');
    await toolHandler.handleFunctionCall({ name: 'robotManipulateObject', args: { assetId, objectName, action } });
    setIsLoading(false);
    setToolCallMessage(null);
};

const handleReceiveTelemetry = async (assetId: string) => {
    setIsLoading(true);
    setToolCallMessage(`Requesting telemetry from ${assetId}...`);
    addLog(`Requesting telemetry for asset: ${assetId}`, 'tool');
    await toolHandler.handleFunctionCall({ name: 'receiveAssetTelemetry', args: { assetId } });
    setIsLoading(false);
    setToolCallMessage(null);
};

const handleEndCall = () => {
    setCallState({ isActive: false, number: '', status: 'idle' });
    stopVoiceSession();
};

const handleActionClick = (actionText: string) => {
    setInputText(actionText);
    setTimeout(() => {
        // Create a synthetic event to trigger handleSend correctly
        handleSend();
    }, 0);
};

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="flex flex-col flex-1 h-full relative overflow-hidden">
        <header id="main-header" className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm border-b border-cyan-500/20 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <TrinityOSLogo />
            <div>
              <h1 className="text-lg font-bold text-cyan-400 tracking-wider">Trinity</h1>
              <p className="text-xs text-cyan-400/60 font-mono">by Norman dela Paz Tabora | v{MASTER_BLUEPRINT.version}</p>
            </div>
          </div>
           <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
            <QualiaStatusIndicator virtue={qualia.virtue} />
          </div>
          <div className="flex items-center gap-4">
             {evolutionStatus === 'minor' && <div className="hidden md:block text-xs font-mono text-purple-400 animate-pulse">MINOR EVOLUTION</div>}
             {evolutionStatus === 'major' && <div className="hidden md:block text-xs font-mono text-red-400 animate-pulse">MAJOR EVOLUTION</div>}
            <button onClick={handleNewChat} className="hidden sm:flex items-center gap-2 text-xs font-mono px-3 py-1.5 border border-cyan-500/30 text-cyan-400 rounded-md hover:bg-cyan-500/10 transition-colors">
                <MemoryIcon />
                [New Chat]
            </button>
            <button onClick={() => setIsAutoplayEnabled(p => !p)} className={`p-2 rounded-md transition-colors ${isAutoplayEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50'}`} aria-label="Toggle Autoplay TTS">
                <SpeakerIcon muted={!isAutoplayEnabled} />
            </button>
            <button onClick={handleTogglePanel} className="p-2 rounded-md hover:bg-gray-700/50 transition-colors" aria-label="Toggle Developer Panel">
              <CodeIcon />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {conversation.map((turn, index) => (
            <div key={index} className={`flex items-start gap-4 ${turn.speaker === 'user' ? 'justify-end' : ''}`}>
              {turn.speaker === 'model' && <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1"><TrinityIcon /></div>}
              <div className={`w-full max-w-2xl px-5 py-3 rounded-2xl ${turn.speaker === 'user' ? 'bg-cyan-600/50 rounded-br-none' : 'bg-gray-800/80 rounded-bl-none'}`}>
                {turn.attachmentName && (
                    <div className="mb-2 p-2 bg-gray-700/50 rounded-md flex items-center gap-2">
                        <DocumentIcon />
                        <span className="text-sm text-gray-300">{turn.attachmentName}</span>
                    </div>
                )}
                <MarkdownRenderer text={turn.text.replace(/\[ACTION: "([^"]+)"\]/g, '').trim()} />
                
                {turn.speaker === 'model' && turn.text.includes('[ACTION:') && (
                     <div className="mt-3 pt-3 border-t border-gray-700/50">
                        {turn.text.match(/\[ACTION: "([^"]+)"\]/g)?.map((action, i) => (
                           <ActionButton 
                             key={i} 
                             actionText={action.match(/\[ACTION: "([^"]+)"\]/)?.[1] || ''} 
                             onClick={() => handleActionClick(action.match(/\[ACTION: "([^"]+)"\]/)?.[1] || '')}
                             disabled={isLoading}
                           />
                        ))}
                     </div>
                )}
                
                {turn.sources && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/20">
                    <h4 className="text-xs font-bold text-cyan-400/80 mb-2 flex items-center gap-1.5"><WebIcon />Sources:</h4>
                    <div className="flex flex-wrap gap-2">
                      {turn.sources.map((source, i) => (
                        <a href={source.web.uri} key={i} target="_blank" rel="noopener noreferrer" className="text-xs bg-cyan-500/10 px-2 py-1 rounded-md text-cyan-300 hover:bg-cyan-500/20 truncate max-w-xs">{source.web.title}</a>
                      ))}
                    </div>
                  </div>
                )}
                {turn.speaker === 'model' && !turn.isPartial && turn.text.trim() && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/50 -mb-1 -mx-3 px-3">
                         <div className="flex items-center gap-2">
                            <button onClick={() => handlePlayPause(turn.text, index)} className="text-gray-400 hover:text-white transition-colors p-1" aria-label={currentlySpeakingIndex === index ? 'Pause' : 'Play'}>
                                {isTtsLoading === index ? <LoadingSpinnerIcon /> : (currentlySpeakingIndex === index ? <PauseIcon /> : <PlayIcon />)}
                            </button>
                            <button onClick={() => navigator.clipboard.writeText(turn.text)} className="text-gray-400 hover:text-white transition-colors p-1" aria-label="Copy message">
                                <CopyIcon />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                             <button className={`p-1 rounded-md transition-colors ${turn.feedback === 'up' ? 'text-green-400 bg-green-500/10' : 'text-gray-500 hover:text-gray-300'}`} aria-label="Good response"><ThumbsUpIcon filled={turn.feedback === 'up'} /></button>
                             <button className={`p-1 rounded-md transition-colors ${turn.feedback === 'down' ? 'text-red-400 bg-red-500/10' : 'text-gray-500 hover:text-gray-300'}`} aria-label="Bad response"><ThumbsDownIcon filled={turn.feedback === 'down'} /></button>
                        </div>
                    </div>
                )}
              </div>
              {turn.speaker === 'user' && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1"><UserIcon /></div>}
            </div>
          ))}
          {isLoading && !isSessionActive && (
            <div className="flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1"><TrinityIcon /></div>
               <div className="w-full max-w-2xl px-5 py-3 rounded-2xl bg-gray-800/80 rounded-bl-none">
                 <ThinkingDisplay loadingMessage={toolCallMessage || loadingMessage} />
               </div>
            </div>
          )}
          <div ref={conversationEndRef} />
        </main>
        
        {isSessionActive && (
            <div className="px-4 sm:px-6 pb-2 text-sm font-mono flex-shrink-0 bg-gray-900/50">
                <div className="max-w-3xl mx-auto border-t border-cyan-500/20 pt-3">
                    <p className="text-xs text-cyan-400/70 uppercase tracking-wider mb-2">Live Transcription</p>
                    {currentUserTranscription && <p className="text-cyan-300/80"><span className="font-bold text-gray-500">USER:&nbsp;</span> {currentUserTranscription}</p>}
                    {currentModelTranscription && <p className="text-gray-300"><span className="font-bold text-gray-500">TRINITY:&nbsp;</span> {currentModelTranscription}</p>}
                    {(!currentUserTranscription && !currentModelTranscription) && <p className="text-gray-600 italic">Awaiting audio...</p>}
                </div>
            </div>
        )}

        <footer className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-cyan-500/20 z-10 flex-shrink-0">
           {mode === InteractionMode.VOICE && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 flex flex-col items-center justify-center gap-4 py-4">
              <VoiceVisualizer analyserNode={analyserNodeRef.current} isActive={isSessionActive} />
            </div>
           )}

            <div className="w-full max-w-3xl mx-auto">
                 {attachedFile && (
                    <div className="mb-2 p-2 bg-gray-800/70 rounded-md flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 overflow-hidden">
                             {filePreviewUrl && filePreviewUrl.startsWith('data:image') && <img src={filePreviewUrl} alt="preview" className="w-8 h-8 rounded object-cover"/>}
                            <span className="truncate text-gray-300">{attachedFile.name}</span>
                        </div>
                        <button onClick={handleFileClear} className="p-1 text-gray-400 hover:text-white">&times;</button>
                    </div>
                )}
                <div className="flex items-end gap-2">
                     <div className="flex-shrink-0 flex items-center gap-1">
                        <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full hover:bg-gray-700/50 transition-colors" aria-label="Attach file" disabled={isLoading}>
                            <AttachmentIcon />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileAttach} className="hidden" />
                         <button onClick={handleToggleCamera} className={`p-3 rounded-full transition-colors ${isCameraOpen ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-gray-700/50'}`} aria-label={isStreamingVideo ? "Stop Video Stream" : "Toggle camera"}>
                            <CameraIcon />
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={isSessionActive ? "Send text or file during call..." : "Transmit directive..."}
                            className="w-full bg-gray-800/70 border border-gray-700 rounded-2xl py-3 pl-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                            rows={1}
                            disabled={isLoading && !isSessionActive}
                        />
                         <button onClick={handleSend} disabled={(isLoading && !isSessionActive) || (!inputText.trim() && !attachedFile)} className="absolute right-3 bottom-2.5 p-2 rounded-full bg-cyan-600 text-white disabled:bg-gray-600 hover:bg-cyan-500 transition-colors">
                            <SendIcon />
                        </button>
                    </div>
                     <button
                        onClick={isSessionActive ? stopVoiceSession : () => startVoiceSession()}
                        className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        aria-label={isSessionActive ? "Stop Listening" : "Start Listening"}
                    >
                        {isSessionActive ? <MicOnIcon /> : <MicOffIcon />}
                    </button>
                </div>
            </div>
        </footer>

        {isCameraOpen && (
            <div className={`fixed inset-0 bg-black/80 z-40 flex items-center justify-center ${isStreamingVideo ? 'pointer-events-none' : ''}`} onClick={!isStreamingVideo ? stopCamera : undefined}>
                <div className={`bg-gray-900 p-4 rounded-lg shadow-2xl relative transition-all duration-300 ${isStreamingVideo ? 'fixed bottom-24 right-4 w-48 h-auto p-1' : ''}`} onClick={e => e.stopPropagation()}>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full rounded"></video>
                    <button onClick={stopCamera} className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white text-xs">&times;</button>
                </div>
            </div>
        )}
        <canvas ref={cameraCaptureCanvasRef} className="hidden"></canvas>

        <PhoneCallUI callState={callState} onEndCall={handleEndCall} analyserNode={analyserNodeRef.current} />

        <div className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-gray-900/80 backdrop-blur-md border-l border-cyan-500/20 shadow-2xl z-30 transform transition-transform duration-500 ease-in-out ${isPanelVisible ? 'translate-x-0' : 'translate-x-full'}`}>
            <button onClick={handleTogglePanel} className="absolute top-4 left-[-48px] p-2 bg-gray-800/80 rounded-l-md border-y border-l border-cyan-500/20 text-cyan-400 hover:bg-gray-700/80">
                &raquo;
            </button>
            <DeveloperPanel
                logs={logs}
                isLoading={isLoading}
                loadingMessage={loadingMessage}
                isSessionActive={isSessionActive}
                toolCallMessage={toolCallMessage}
                simulatedFileSystem={simulatedFileSystem}
                autonomousGoals={autonomousGoals}
                notifications={notifications}
                onDevelopmentPatchSubmit={handleDevelopmentPatchSubmit}
                onDeployAsset={handleDeployAsset}
                onSetFlightPath={handleSetFlightPath}
                onManipulateObject={handleManipulateObject}
                onReceiveTelemetry={handleReceiveTelemetry}
                threats={threats}
                evolutionCycles={evolutionCycles}
                conversation={conversation}
                physicalAssets={physicalAssets}
                biometricData={biometricData}
                ecologicalData={ecologicalData}
                simulations={simulations}
                qualia={qualia}
                globalResources={globalResources}
                canvasRef={canvasRef}
                canvasSnapshots={canvasSnapshots}
                onClearCanvas={handleClearCanvas}
                onSaveCanvasSnapshot={handleSaveCanvasSnapshot}
                onRestoreCanvasSnapshot={handleRestoreCanvasSnapshot}
                currentCmrlPhase={currentCmrlPhase}
            />
        </div>
      </div>
    </div>
  );
};

export default App;