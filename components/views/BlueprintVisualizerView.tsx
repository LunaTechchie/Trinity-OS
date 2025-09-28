import React, { useState } from 'react';
import blueprint from '../../trinity.blueprint.ts';
import { BookOpenIcon } from '../icons/BookOpenIcon';

interface TreeNodeProps {
  nodeKey: string;
  nodeValue: any;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ nodeKey, nodeValue, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first few levels
  const isObject = typeof nodeValue === 'object' && nodeValue !== null && !Array.isArray(nodeValue);
  const isArray = Array.isArray(nodeValue);

  const handleToggle = () => {
    if (isObject || isArray) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderValue = () => {
    if (isObject) {
      return isExpanded ? Object.entries(nodeValue).map(([key, value]) => (
        <TreeNode key={key} nodeKey={key} nodeValue={value} level={level + 1} />
      )) : '{...}';
    }
    if (isArray) {
      return isExpanded ? nodeValue.map((item, index) => (
        <TreeNode key={index} nodeKey={`[${index}]`} nodeValue={item} level={level + 1} />
      )) : '[...]';
    }
    if (typeof nodeValue === 'string') {
        return <span className="text-green-300">"{nodeValue}"</span>
    }
    if (typeof nodeValue === 'number') {
        return <span className="text-purple-300">{nodeValue}</span>
    }
     if (typeof nodeValue === 'boolean') {
        return <span className="text-orange-400">{String(nodeValue)}</span>
    }
    return String(nodeValue);
  };

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      <div className="flex items-start cursor-pointer hover:bg-gray-800/50 rounded" onClick={handleToggle}>
        {(isObject || isArray) && (
          <span className="w-4 text-cyan-400">{isExpanded ? '▼' : '►'}</span>
        )}
        <strong className="text-cyan-300 mr-2">{nodeKey}:</strong>
        <div className="flex-1">
          {renderValue()}
        </div>
      </div>
    </div>
  );
};

export const BlueprintVisualizerView: React.FC = () => {
  return (
    <div className="bg-gray-900/50 p-4 rounded-md h-full flex flex-col font-mono text-sm text-gray-300">
      <h3 className="font-bold text-lg text-cyan-400 mb-2 flex items-center gap-2">
        <BookOpenIcon />
        <span>INTERACTIVE BLUEPRINT VISUALIZER</span>
      </h3>
       <p className="text-xs text-gray-400/80 mb-6 italic">
        An explorable, dynamic representation of the complete TrisynOS architecture. Expand and collapse nodes to inspect the system's core structure and governing principles.
      </p>
      <div className="flex-grow overflow-y-auto bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
        {Object.entries(blueprint).map(([key, value]) => (
          <TreeNode key={key} nodeKey={key} nodeValue={value} level={0} />
        ))}
      </div>
    </div>
  );
};
