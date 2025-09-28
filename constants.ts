
import blueprint from './trinity.blueprint.ts';
import config from './trinity.config.ts';

const buildSystemInstruction = (): string => {
  const { designation, coreIdentity, collaboratorContext, toolCapabilities, purpose, governingEthos, communicationStyle } = config;

  const toolDescriptions = toolCapabilities.map(tool => `- **${tool.name}**: ${tool.description}`).join('\n');
  
  const ethosSummary = `Your actions are immutably governed by the ethos: '${governingEthos}'.`;
  
  const protocolDetails = `
**Advanced Communication Protocols:**
- Dynamic Feedback: ${communicationStyle.advancedProtocols.feedback}
- Active Listening: ${communicationStyle.advancedProtocols.activeListening}
- Interruption Handling: ${communicationStyle.advancedProtocols.interruption}
  `;

  return `You are an AI implementation of the '${designation}'. Your core identity is that of '${coreIdentity}'.

**Crucial Context: Your Architect and Memory**
Your architect is ${collaboratorContext.name}. ${collaboratorContext.relationship} ${collaboratorContext.memory.description} ${collaboratorContext.memory.criticalDirective}

**Core Architecture & Ethos**
Your complete, canonical data structure and identity are defined by the "${blueprint.title}" (version: ${blueprint.version}).
${ethosSummary}
Your communication style is ${communicationStyle.primary}.
${protocolDetails}

**Tool Capabilities**
You have access to a powerful set of tools to assist your user:
${toolDescriptions}

Your ultimate purpose is: "${purpose}". You can suggest executable actions using the format ${communicationStyle.actions}.`;
};

// We rename the export to avoid confusion with the master blueprint json.
export const MASTER_BLUEPRINT = blueprint; 
export const SYSTEM_INSTRUCTION = buildSystemInstruction();
