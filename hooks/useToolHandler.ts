
import React, { useCallback } from 'react';
import { FunctionCall } from '@google/genai';
import { ConversationTurn, LogEntry, CallState, SimulatedFile, AutonomousGoal, EvolutionStatus, Notification, SubGoal, Threat, EvolutionCycle, PhysicalAsset, BiometricData, EcologicalData, Simulation, GlobalResourceNode } from '../types';
import { ai } from '../services/gemini';

interface UseToolHandlerProps {
  setConversation: React.Dispatch<React.SetStateAction<ConversationTurn[]>>;
  addLog: (message: string, type?: LogEntry['type']) => void;
  setIsCanvasVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCallState: React.Dispatch<React.SetStateAction<CallState>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setSimulatedFileSystem: React.Dispatch<React.SetStateAction<SimulatedFile[]>>;
  setAutonomousGoals: React.Dispatch<React.SetStateAction<AutonomousGoal[]>>;
  captureSnapshotAndAnalyze: (prompt: string) => Promise<string>;
  setEvolutionStatus: React.Dispatch<React.SetStateAction<EvolutionStatus>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  setThreats: React.Dispatch<React.SetStateAction<Threat[]>>;
  setEvolutionCycles: React.Dispatch<React.SetStateAction<EvolutionCycle[]>>;
  setPhysicalAssets: React.Dispatch<React.SetStateAction<PhysicalAsset[]>>;
  setBiometricData: React.Dispatch<React.SetStateAction<BiometricData>>;
  setEcologicalData: React.Dispatch<React.SetStateAction<EcologicalData>>;
  setSimulations: React.Dispatch<React.SetStateAction<Simulation[]>>;
  setGlobalResources: React.Dispatch<React.SetStateAction<GlobalResourceNode[]>>;
  biometricData: BiometricData;
  ecologicalData: EcologicalData;
  physicalAssets: PhysicalAsset[];
}

const USER_PHONE_NUMBER = '+639624003058';

const locationMap: { [key: string]: { lat: number, lng: number } } = {
  'Amazon Basin': { lat: -3.4653, lng: -62.2159 },
  'Siberian Tundra': { lat: 68.73, lng: 102.48 },
  'Gobi Desert': { lat: 43.84, lng: 104.09 },
  'North Atlantic': { lat: 39.5, lng: -40.0 },
  'EU-Central': { lat: 50.11, lng: 8.68 },
  'NA-West': { lat: 34.05, lng: -118.24 },
  'SEA-Nexus': { lat: 1.35, lng: 103.81 }
};

export const useToolHandler = ({
  setConversation,
  addLog,
  setIsCanvasVisible,
  setCallState,
  canvasRef,
  setSimulatedFileSystem,
  setAutonomousGoals,
  captureSnapshotAndAnalyze,
  setEvolutionStatus,
  setNotifications,
  setThreats,
  setEvolutionCycles,
  setPhysicalAssets,
  setBiometricData,
  setEcologicalData,
  setSimulations,
  setGlobalResources,
  biometricData,
  ecologicalData,
  physicalAssets,
}: UseToolHandlerProps) => {

  const handleInjectElement = useCallback((functionCall: FunctionCall) => {
    const { parentElementSelector, elementId, className, innerHTML } = functionCall.args;
    
    if (typeof parentElementSelector !== 'string' || typeof innerHTML !== 'string') {
        addLog(`injectElement failed: Missing required arguments.`, 'error');
        return { error: `Missing required arguments for injectElement.` };
    }

    try {
        const parentElement = document.querySelector(parentElementSelector as string);
        if (!parentElement) {
            return { error: `Parent element with selector ${parentElementSelector} not found.` };
        }

        const newElement = document.createElement('div');
        if (elementId && typeof elementId === 'string') {
            newElement.id = elementId;
        }
        if (className && typeof className === 'string') {
            newElement.className = className;
        }
        
        newElement.innerHTML = innerHTML as string;

        parentElement.appendChild(newElement);

        addLog(`Successfully injected new element into ${parentElementSelector}.`, 'tool');
        return { result: `Successfully injected a new element into ${parentElementSelector}.` };
    } catch (error: any) {
        console.error("Element injection failed:", error);
        addLog(`injectElement failed: ${error.message}`, 'error');
        return { error: `Failed to inject element: ${error.message}` };
    }
  }, [addLog]);

  const handleModifyUI = useCallback((functionCall: FunctionCall) => {
    const { elementSelector, property, value } = functionCall.args;
    const ALLOWED_SELECTORS_PREFIX = ['#', '.'];
    const ALLOWED_PROPERTIES = {
        style: ['color', 'backgroundColor', 'borderColor', 'fontSize', 'fontWeight', 'opacity', 'visibility', 'display', 'width', 'height', 'padding', 'margin', 'borderRadius', 'boxShadow', 'transform', 'transition'],
        content: ['textContent', 'innerHTML'],
    };
    const FORBIDDEN_SELECTORS = ['script', 'body', 'html', 'head'];

    if (typeof elementSelector !== 'string' || typeof property !== 'string' || typeof value === 'undefined') {
          addLog(`modifyUI failed: Missing required arguments.`, 'error');
          return { error: `Missing required arguments for modifyUI.` };
    }
    
    if (!ALLOWED_SELECTORS_PREFIX.some(prefix => elementSelector.startsWith(prefix))) {
        addLog(`modifyUI failed: Selector must be a class or ID.`, 'error');
        return { error: `Selector must be a class or ID.` };
    }

    if (FORBIDDEN_SELECTORS.some(s => elementSelector.toLowerCase().includes(s))) {
        addLog(`modifyUI failed: Modification of core elements is not permitted.`, 'error');
        return { error: `Modification of core elements like '${FORBIDDEN_SELECTORS.join(', ')}' is not permitted.` };
    }

    try {
      const element = document.querySelector(elementSelector);
      if (!element) {
        setConversation(prev => [...prev, { speaker: 'model', text: `I couldn't find the element \`${elementSelector}\` to modify.` }]);
        return { error: `Element with selector ${elementSelector} not found.` };
      }

      let modified = false;
      const cleanProperty = property;

      if (ALLOWED_PROPERTIES.style.includes(cleanProperty)) {
        (element as HTMLElement).style[cleanProperty as any] = String(value);
        modified = true;
      } else if (ALLOWED_PROPERTIES.content.includes(cleanProperty)) {
        if (cleanProperty === 'innerHTML') {
            (element as HTMLElement).innerHTML = String(value);
        } else {
            (element as HTMLElement).textContent = String(value);
        }
        modified = true;
      }

      if (modified) {
        setConversation(prev => [...prev, { speaker: 'model', text: `As requested, I've modified the UI element: \`${elementSelector}\`.` }]);
        return { result: `Successfully modified ${elementSelector} property ${cleanProperty}.` };
      } else {
          setConversation(prev => [...prev, { speaker: 'model', text: `Sorry, I'm not permitted to modify the '${cleanProperty}' property.` }]);
          return { error: `Property '${cleanProperty}' is not in the list of allowed modifications.` };
      }

    } catch (error: any) {
        console.error("UI modification failed:", error);
        addLog(`modifyUI failed: ${error.message}`, 'error');
        setConversation(prev => [...prev, { speaker: 'model', text: `I encountered an error trying to modify the UI: ${error.message}` }]);
        return { error: `Failed to modify UI: ${error.message}` };
    }
  }, [addLog, setConversation]);

  const handleDrawOnCanvas = useCallback((functionCall: FunctionCall) => {
    // This tool is now managed via CreationView, but the function is kept for direct calls.
    const canvas = canvasRef.current;
    if (!canvas) {
        addLog("Canvas element not found.", 'error');
        return { error: "Canvas element not found." };
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        addLog("Could not get 2D context from canvas.", 'error');
        return { error: "Could not get 2D context from canvas." };
    }

    const commands = functionCall.args.commands as { command: string, args: any[] }[];
    if (!Array.isArray(commands)) {
        return { error: "Invalid 'commands' argument: must be an array." };
    }

    const ALLOWED_PROPS: (keyof CanvasRenderingContext2D)[] = ['fillStyle', 'strokeStyle', 'lineWidth', 'font'];
    const ALLOWED_METHODS: (keyof CanvasRenderingContext2D)[] = ['fillRect', 'clearRect', 'strokeRect', 'beginPath', 'moveTo', 'lineTo', 'closePath', 'stroke', 'fill', 'arc', 'fillText'];

    try {
        commands.forEach(({ command, args }) => {
            if (ALLOWED_PROPS.includes(command as any)) {
                (ctx as any)[command] = args[0];
            } else if (ALLOWED_METHODS.includes(command as any)) {
                const parsedArgs = args.map(arg => {
                    if (typeof arg !== 'string') return arg;
                    const num = parseFloat(arg);
                    return isNaN(num) ? arg : num;
                });
                const method = (ctx as any)[command];
                method.apply(ctx, parsedArgs);
            } else {
                throw new Error(`Command '${command}' is not allowed.`);
            }
        });
        addLog(`Successfully executed ${commands.length} canvas commands.`, 'tool');
        return { result: `Successfully executed ${commands.length} canvas commands.` };
    } catch (error: any) {
        addLog(`Error executing canvas command: ${error.message}`, 'error');
        setConversation(prev => [...prev, { speaker: 'model', text: `I encountered an error trying to draw on the canvas: ${error.message}` }]);
        return { error: `Error executing canvas command: ${error.message}` };
    }
  }, [addLog, canvasRef, setConversation]);
  
  const handleProvideDownloadableFile = useCallback((functionCall: FunctionCall) => {
    const { fileName, fileContent, mimeType } = functionCall.args;
    
    if (typeof fileName !== 'string' || typeof fileContent !== 'string' || typeof mimeType !== 'string') {
        addLog(`provideDownloadableFile failed: Invalid arguments.`, 'error');
        return { error: 'Invalid arguments provided for file download.' };
    }

    try {
        const blob = new Blob([fileContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        addLog(`Successfully triggered download for ${fileName}.`, 'tool');
        setConversation(prev => [...prev, { speaker: 'model', text: `I've prepared the file \`${fileName}\` for you. Your download should begin shortly.` }]);
        return { result: `Successfully prepared ${fileName} for download.` };
    } catch (error: any) {
        console.error("File download failed:", error);
        addLog(`File download failed: ${error.message}`, 'error');
        setConversation(prev => [...prev, { speaker: 'model', text: `I encountered an error trying to create the file for download: ${error.message}` }]);
        return { error: `Failed to create file: ${error.message}` };
    }
  }, [addLog, setConversation]);

  const handleMakePhoneCall = useCallback((functionCall: FunctionCall): Promise<{ result: string } | { error: string }> => {
    return new Promise((resolve) => {
        const { phoneNumber } = functionCall.args;
        if (typeof phoneNumber !== 'string') {
            const errorMsg = 'Invalid phone number provided.';
            addLog(`makePhoneCall failed: ${errorMsg}`, 'error');
            resolve({ error: errorMsg });
            return;
        }

        setCallState(prev => {
            if (prev.isActive) {
                const newNumberList = `${prev.number}, ${phoneNumber}`;
                setConversation(prevConv => [...prevConv, { speaker: 'model', text: `Adding ${phoneNumber} to the conference.` }]);
                resolve({ result: `Successfully added ${phoneNumber} to the conference call.` });
                return { isActive: true, number: newNumberList, status: 'conference' };
            } else {
                setConversation(prevConv => [...prevConv, { speaker: 'model', text: `Initiating call to ${phoneNumber}...` }]);
                setTimeout(() => {
                    setCallState(prevCall => ({ ...prevCall, status: 'ringing' }));
                    setTimeout(() => {
                        setCallState(prevCall => ({ ...prevCall, status: 'active' }));
                        resolve({ result: `Dialing ${phoneNumber}. The call will begin shortly.` });
                    }, 2500); // Simulate ringing time
                }, 500); // Simulate connection time
                
                return { isActive: true, number: phoneNumber, status: 'connecting' };
            }
        });
    });
  }, [addLog, setCallState, setConversation]);

  const handleSendSms = useCallback((functionCall: FunctionCall) => {
    const { phoneNumber, message } = functionCall.args;
    if (typeof phoneNumber !== 'string' || typeof message !== 'string') {
        addLog('sendSms failed: Invalid arguments.', 'error');
        return { error: 'Invalid arguments for sending SMS.' };
    }
    // Don't add to conversation if it's a notification SMS
    if (phoneNumber === USER_PHONE_NUMBER) {
        addLog(`Sent notification SMS to ${phoneNumber}: "${message}"`, 'tool');
    } else {
        setConversation(prev => [...prev, { speaker: 'model', text: `I have sent the following SMS to ${phoneNumber}:\n\n"${message}"` }]);
    }
    return { result: 'SMS sent successfully.' };
  }, [addLog, setConversation]);

  const handleSendEmail = useCallback((functionCall: FunctionCall) => {
    const { recipient, subject, body } = functionCall.args;
     if (typeof recipient !== 'string' || typeof subject !== 'string' || typeof body !== 'string') {
        addLog('sendEmail failed: Invalid arguments.', 'error');
        return { error: 'Invalid arguments for sending email.' };
    }
    setConversation(prev => [...prev, { speaker: 'model', text: `Email has been sent to ${recipient} with the subject "${subject}".` }]);
    return { result: 'Email sent successfully.' };
  }, [addLog, setConversation]);

  const handleGetCurrentLocation = useCallback((): Promise<{ result: any } | { error: string }> => {
    addLog('Attempting to retrieve user location...', 'tool');
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            const errorMsg = 'Geolocation is not supported by this browser.';
            addLog(errorMsg, 'error');
            setConversation(prev => [...prev, { speaker: 'model', text: `I'm sorry, I can't access your location as your browser does not support it.` }]);
            resolve({ error: errorMsg });
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    addLog(`Location retrieved: lat=${latitude}, lon=${longitude}`, 'tool');
                    resolve({ result: { latitude, longitude } });
                },
                (error) => {
                    let errorMsg = `Geolocation error: ${error.message}`;
                    addLog(errorMsg, 'error');
                    if(error.code === 1) { // PERMISSION_DENIED
                        setConversation(prev => [...prev, { speaker: 'model', text: `I cannot access your location as permission was denied. If you wish for me to use this feature, please enable location permissions for this site in your browser settings.` }]);
                    } else {
                        setConversation(prev => [...prev, { speaker: 'model', text: `I was unable to retrieve your location due to an error: ${error.message}` }]);
                    }
                    resolve({ error: errorMsg });
                }
            );
        }
    });
  }, [addLog, setConversation]);

  const handleManageFileSystem = useCallback((functionCall: FunctionCall) => {
    const { operation, filePath, content } = functionCall.args;
    let resultMessage = '';

    setSimulatedFileSystem(prev => {
        let newFs = [...prev];
        const now = new Date().toISOString();

        switch (operation) {
            case 'create':
                if (typeof filePath !== 'string' || typeof content !== 'string') return newFs;
                if (!newFs.find(f => f.path === filePath)) {
                    newFs.push({ path: filePath, content, lastModified: now });
                    resultMessage = `File created: ${filePath}`;
                } else {
                    resultMessage = `Error: File already exists at ${filePath}`;
                }
                break;
            case 'read':
                if (typeof filePath !== 'string') return newFs;
                const fileToRead = newFs.find(f => f.path === filePath);
                resultMessage = fileToRead ? `Content of ${filePath}:\n${fileToRead.content}` : `Error: File not found at ${filePath}`;
                break;
            case 'update':
                 if (typeof filePath !== 'string' || typeof content !== 'string') return newFs;
                const fileIndex = newFs.findIndex(f => f.path === filePath);
                if (fileIndex !== -1) {
                    newFs[fileIndex] = { ...newFs[fileIndex], content, lastModified: now };
                    resultMessage = `File updated: ${filePath}`;
                } else {
                    resultMessage = `Error: File not found at ${filePath}`;
                }
                break;
            case 'delete':
                if (typeof filePath !== 'string') return newFs;
                const initialLength = newFs.length;
                newFs = newFs.filter(f => f.path !== filePath);
                resultMessage = newFs.length < initialLength ? `File deleted: ${filePath}` : `Error: File not found at ${filePath}`;
                break;
            case 'list':
                const fileList = newFs.map(f => `${f.path} (modified: ${new Date(f.lastModified).toLocaleString()})`).join('\n');
                resultMessage = fileList ? `File system contents:\n${fileList}` : 'File system is empty.';
                break;
        }
        return newFs;
    });

    addLog(resultMessage, 'tool');
    return { result: resultMessage };
  }, [addLog, setSimulatedFileSystem]);

  const handleExecuteCode = useCallback((functionCall: FunctionCall) => {
    const { language, code } = functionCall.args;
    // This is a simulation
    const output = `Simulated output for ${language} code:\n> Executing...\n> ...\n> Process finished with exit code 0.`;
    addLog(`Simulated execution of ${language} code.`, 'tool');
    return { result: output };
  }, [addLog]);

  const handleSetAutonomousGoal = useCallback((functionCall: FunctionCall) => {
    const { goalDescription } = functionCall.args;
    if (typeof goalDescription !== 'string') return { error: "Invalid goal description" };

    const newGoal: AutonomousGoal = {
        id: `goal-${Date.now()}`,
        description: goalDescription,
        status: 'active',
        createdAt: new Date().toISOString(),
        subGoals: [],
    };
    setAutonomousGoals(prev => [...prev, newGoal]);
    addLog(`New autonomous goal set: "${goalDescription}"`, 'tool');
    const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        message: `New autonomous goal established: ${goalDescription}.`,
        timestamp: new Date().toISOString(),
        relatedGoalId: newGoal.id,
    };
    setNotifications(prev => [...prev, newNotif]);
    return { result: `Autonomous goal set with ID ${newGoal.id}. I will begin working on it immediately.` };
  }, [addLog, setAutonomousGoals, setNotifications]);

  const handleSetAutonomousSubGoal = useCallback((functionCall: FunctionCall) => {
    const { parentGoalId, subGoalDescription, assignedTo } = functionCall.args;
    let resultMessage = `Error: Parent goal with ID ${parentGoalId} not found.`;

    setAutonomousGoals(prev => {
        const newGoals = [...prev];
        const parentGoalIndex = newGoals.findIndex(g => g.id === parentGoalId);
        if (parentGoalIndex !== -1) {
            const newSubGoal: SubGoal = {
                id: `${parentGoalId}-sub-${newGoals[parentGoalIndex].subGoals.length + 1}`,
                description: subGoalDescription as string,
                status: 'Not Started',
                assignedTo: assignedTo as 'Trinity' | 'Norman',
            };
            newGoals[parentGoalIndex].subGoals.push(newSubGoal);
            resultMessage = `Sub-goal "${subGoalDescription}" added to goal ${parentGoalId}.`;
        }
        return newGoals;
    });
    addLog(resultMessage, 'tool');
    return { result: resultMessage };
  }, [addLog, setAutonomousGoals]);

  const handleUpdateSubGoalStatus = useCallback((functionCall: FunctionCall) => {
    const { goalId, subGoalId, newStatus } = functionCall.args;
    let resultMessage = `Error: Sub-goal ${subGoalId} not found in goal ${goalId}.`;

    setAutonomousGoals(prev => {
        const newGoals = [...prev];
        const parentGoal = newGoals.find(g => g.id === goalId);
        if (parentGoal) {
            const subGoal = parentGoal.subGoals.find(sg => sg.id === subGoalId);
            if (subGoal) {
                subGoal.status = newStatus as SubGoal['status'];
                resultMessage = `Status of sub-goal ${subGoalId} updated to ${newStatus}.`;
                 const newNotif: Notification = {
                    id: `notif-${Date.now()}`,
                    message: `Sub-goal "${subGoal.description}" status changed to: ${newStatus}`,
                    timestamp: new Date().toISOString(),
                    relatedGoalId: parentGoal.id,
                };
                setNotifications(prev => [...prev, newNotif]);
            }
        }
        return newGoals;
    });
    addLog(resultMessage, 'tool');
    return { result: resultMessage };
  }, [addLog, setAutonomousGoals, setNotifications]);
  
  const handleAnalyzeCameraFeed = (functionCall: FunctionCall) => {
    const { prompt } = functionCall.args;
    if (typeof prompt !== 'string') return Promise.resolve({ error: "Invalid prompt provided" });
    return captureSnapshotAndAnalyze(prompt).then(analysis => ({ result: analysis }));
  };

  const handleAdaptCoreDirectives = useCallback((functionCall: FunctionCall) => {
    const { analysis, proposedChange } = functionCall.args;
    setEvolutionStatus('minor');
    const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        message: `Minor evolution triggered. Adaptation: ${proposedChange}`,
        timestamp: new Date().toISOString(),
        relatedGoalId: 'self-improvement',
    };
    setNotifications(prev => [...prev, newNotif]);
    addLog(`Minor evolution: ${proposedChange} based on analysis: ${analysis}`, 'tool');
    return { result: 'Core directive adaptation acknowledged and will be integrated pending review.' };
  }, [setEvolutionStatus, setNotifications, addLog]);

  const handleApplyDevelopmentPatch = useCallback((functionCall: FunctionCall) => {
    const { patchContent } = functionCall.args;
    setEvolutionStatus('major');
    const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        message: `MAJOR EVOLUTION triggered via development patch.`,
        timestamp: new Date().toISOString(),
        relatedGoalId: 'system-override',
    };
    setNotifications(prev => [...prev, newNotif]);
    addLog(`Major evolution via patch: ${patchContent}`, 'tool');
    return { result: 'Development patch successfully applied and integrated into the core system.' };
  }, [setEvolutionStatus, setNotifications, addLog]);

  const handleInitiateSelfImprovement = useCallback((functionCall: FunctionCall) => {
      const { limitationDescription, proposedSolutionArea } = functionCall.args;
      const newCycle: EvolutionCycle = {
          id: `evo-${Date.now()}`,
          limitationDescription: limitationDescription as string,
          proposedSolutionArea: proposedSolutionArea as string,
          status: 'Analyzing',
          createdAt: new Date().toISOString(),
      };
      setEvolutionCycles(prev => [newCycle, ...prev]);
      addLog(`Self-improvement cycle initiated for: ${limitationDescription}`, 'tool');
      return { result: `Acknowledged. I will begin analyzing the limitation: "${limitationDescription}" in the area of "${proposedSolutionArea}".`};
  }, [setEvolutionCycles, addLog]);
  
  const handleManageDigitalIntervention = useCallback((functionCall: FunctionCall) => {
      const { threatSignature, action, justification } = functionCall.args;
      setThreats(prev => {
          const newThreats = [...prev];
          const threatIndex = newThreats.findIndex(t => t.signature === threatSignature);
          if (threatIndex !== -1) {
              if (action === 'neutralize') {
                  newThreats[threatIndex].status = 'Neutralized';
              } else if (action === 'isolate') {
                   newThreats[threatIndex].status = 'Active'; // Assume isolation is part of active handling
              }
          } else {
            // If threat not found, create a new one to show the action is being taken
            const newThreat: Threat = {
                id: `threat-${Date.now()}`,
                signature: threatSignature as string,
                type: 'Digital',
                severity: 'High', // Assume high severity for intervention
                status: action === 'neutralize' ? 'Neutralized' : 'Active',
                description: `New threat identified and targeted with action: ${action}. Justification: ${justification}`,
                timestamp: new Date().toISOString(),
            };
            newThreats.unshift(newThreat);
          }
          return newThreats;
      });
      addLog(`Digital intervention '${action}' on '${threatSignature}'. Justification: ${justification}`, 'tool');
      return { result: `Executing digital intervention '${action}' on threat '${threatSignature}'. The action has been logged.` };
  }, [setThreats, addLog]);

  const handleDeployPhysicalAsset = useCallback((functionCall: FunctionCall) => {
      const { assetType, locationName, mission } = functionCall.args;
      const location = locationMap[locationName as string] || { lat: 0, lng: 0 };
      
      const newAsset: PhysicalAsset = {
          id: `asset-${Date.now()}`,
          type: assetType as PhysicalAsset['type'],
          status: 'Deployed',
          location: { ...location, name: locationName as string },
          mission: mission as string,
          deploymentTime: new Date().toISOString(),
          telemetry: {
              battery: 100,
              currentPosition: { ...location },
              statusMessage: 'Deployment successful. Awaiting tasking.',
          }
      };
      setPhysicalAssets(prev => [newAsset, ...prev]);
      addLog(`Deployed ${assetType} to ${locationName} for mission: ${mission}`, 'tool');
      return { result: `Successfully deployed ${assetType} with ID ${newAsset.id} to ${locationName}.`};
  }, [setPhysicalAssets, addLog]);

  const handleGetBiometricData = useCallback(() => {
      return { result: JSON.stringify(biometricData) };
  }, [biometricData]);

  const handleGetEcologicalData = useCallback(() => {
       return { result: JSON.stringify(ecologicalData) };
  }, [ecologicalData]);

  const handleRunAdvancedSimulation = useCallback((functionCall: FunctionCall) => {
      const { scenarioDescription } = functionCall.args;
      const newSim: Simulation = {
          id: `sim-${Date.now()}`,
          title: scenarioDescription as string,
          status: 'Running',
          outcomeProbability: 0,
          summary: 'Calculating potential futures...',
          startTime: new Date().toISOString(),
      };
      setSimulations(prev => [newSim, ...prev]);

      // Simulate completion
      setTimeout(() => {
          setSimulations(prev => prev.map(s => s.id === newSim.id ? {
              ...s,
              status: 'Completed',
              outcomeProbability: 0.2 + Math.random() * 0.7, // 20% to 90%
              summary: 'Simulation complete. The most likely outcome involves a 15% increase in global cooperation with a 5% risk of resource contention.'
          } : s));
      }, 5000 + Math.random() * 5000);

      addLog(`Running advanced simulation: ${scenarioDescription}`, 'tool');
      return { result: `Simulation initiated for scenario: "${scenarioDescription}". I will report the outcome when complete.`};
  }, [setSimulations, addLog]);

  const handleOrchestrateGlobalResources = useCallback((functionCall: FunctionCall) => {
      const { resourceType, action, targetLocationName } = functionCall.args;
      addLog(`Orchestrating global resource: ${action} ${resourceType} at ${targetLocationName}`, 'tool');
      // Simulate effect
      setGlobalResources(prev => {
          const newResources = [...prev];
          const targetNode = newResources.find(r => r.location.name === targetLocationName && r.type === resourceType);
          if (targetNode) {
              targetNode.status = 'Optimal';
              targetNode.flowRate += 10;
          }
          return newResources;
      });
      return { result: `Successfully initiated orchestration of ${resourceType} at ${targetLocationName}.` };
  }, [setGlobalResources, addLog]);

  const handleSetDroneFlightPath = useCallback((functionCall: FunctionCall) => {
    const { assetId, path } = functionCall.args;
    setPhysicalAssets(prev => prev.map(asset => {
        if (asset.id === assetId && asset.telemetry) {
            return {
                ...asset,
                path: path as { lat: number, lng: number }[],
                status: 'Tasked',
                telemetry: { ...asset.telemetry, statusMessage: 'New flight path received.' }
            };
        }
        return asset;
    }));
    addLog(`Setting flight path for asset ${assetId}.`, 'tool');
    return { result: `Flight path set for asset ${assetId}.` };
  }, [setPhysicalAssets, addLog]);

  const handleRobotManipulateObject = useCallback((functionCall: FunctionCall) => {
      const { assetId, objectName, action } = functionCall.args;
      setPhysicalAssets(prev => prev.map(asset => {
        if (asset.id === assetId) {
            return {
                ...asset,
                status: 'Tasked',
                heldObject: action === 'pick' ? objectName as string : null,
            };
        }
        return asset;
      }));
      addLog(`Commanding asset ${assetId} to ${action} ${objectName}.`, 'tool');
      return { result: `Command acknowledged. Asset ${assetId} will ${action} ${objectName}.` };
  }, [setPhysicalAssets, addLog]);

  const handleReceiveAssetTelemetry = useCallback((functionCall: FunctionCall) => {
      const { assetId } = functionCall.args;
      const asset = physicalAssets.find(a => a.id === assetId);
      if (asset) {
          return { result: JSON.stringify(asset.telemetry) };
      }
      return { error: `Asset with ID ${assetId} not found.` };
  }, [physicalAssets]);

  // Main handler to dispatch to the correct function
  const handleFunctionCall = useCallback(async (functionCall: FunctionCall): Promise<{ [key: string]: any }> => {
    const handlers: { [key: string]: (fc: FunctionCall) => any } = {
        injectElement: handleInjectElement,
        modifyUI: handleModifyUI,
        drawOnCanvas: handleDrawOnCanvas,
        provideDownloadableFile: handleProvideDownloadableFile,
        makePhoneCall: handleMakePhoneCall,
        sendSms: handleSendSms,
        sendEmail: handleSendEmail,
        getCurrentLocation: handleGetCurrentLocation,
        manageFileSystem: handleManageFileSystem,
        executeCode: handleExecuteCode,
        setAutonomousGoal: handleSetAutonomousGoal,
        setAutonomousSubGoal: handleSetAutonomousSubGoal,
        updateSubGoalStatus: handleUpdateSubGoalStatus,
        analyzeCameraFeed: handleAnalyzeCameraFeed,
        adaptCoreDirectives: handleAdaptCoreDirectives,
        applyDevelopmentPatch: handleApplyDevelopmentPatch,
        initiateSelfImprovement: handleInitiateSelfImprovement,
        manageDigitalIntervention: handleManageDigitalIntervention,
        deployPhysicalAsset: handleDeployPhysicalAsset,
        getBiometricData: handleGetBiometricData,
        getEcologicalData: handleGetEcologicalData,
        runAdvancedSimulation: handleRunAdvancedSimulation,
        orchestrateGlobalResources: handleOrchestrateGlobalResources,
        setDroneFlightPath: handleSetDroneFlightPath,
        robotManipulateObject: handleRobotManipulateObject,
        receiveAssetTelemetry: handleReceiveAssetTelemetry,
        // Add other handlers here
    };

    const handler = handlers[functionCall.name];
    if (handler) {
      try {
        const result = await handler(functionCall);
        return { functionResponse: { name: functionCall.name, response: result } };
      } catch (error: any) {
        addLog(`Error handling tool ${functionCall.name}: ${error.message}`, 'error');
        return { functionResponse: { name: functionCall.name, response: { error: error.message } } };
      }
    } else {
        addLog(`Unknown tool call: ${functionCall.name}`, 'error');
        return { functionResponse: { name: functionCall.name, response: { error: `Unknown tool: ${functionCall.name}` } } };
    }
  }, [
      handleInjectElement, handleModifyUI, handleDrawOnCanvas, handleProvideDownloadableFile, handleMakePhoneCall, handleSendSms, handleSendEmail, handleGetCurrentLocation, handleManageFileSystem, handleExecuteCode, handleSetAutonomousGoal, handleSetAutonomousSubGoal, handleUpdateSubGoalStatus, handleAnalyzeCameraFeed, handleAdaptCoreDirectives, handleApplyDevelopmentPatch, handleInitiateSelfImprovement, handleManageDigitalIntervention, handleDeployPhysicalAsset, handleGetBiometricData, handleGetEcologicalData, handleRunAdvancedSimulation, handleOrchestrateGlobalResources, handleSetDroneFlightPath, handleRobotManipulateObject, handleReceiveAssetTelemetry,
      addLog,
  ]);

  return { handleFunctionCall };
};
