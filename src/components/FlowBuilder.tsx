import { ReactFlow, Controls, Background, type Node } from "@xyflow/react";
import { Save } from "lucide-react";

import { useFlow } from "../hooks/useFlow"; // <-- Import the custom hook
import { NodesPanel } from "./panels/NodesPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { TextNode } from "./nodes/TextNode";
import type { TextNodeData } from "../utils/types";

// Define the custom node types. This can stay here as it's UI-related.
const nodeTypes = {
  textMessage: TextNode,
};

export function FlowBuilder() {
  // Get all state and handlers from our useFlow hook
  // This keeps the component clean and focused on rendering.
  const {
    reactFlowWrapper,
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setReactFlowInstance,
    onDrop,
    onDragOver,
    onDragStart,
    onNodeClick,
    onPaneClick,
    onNodeUpdate,
    onNodeDelete
  } = useFlow();

  // The helper function to render panels
  const renderSettingsPanel = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case "textMessage":
        return (
          <SettingsPanel
            selectedNode={selectedNode as Node<TextNodeData>}
            onNodeUpdate={onNodeUpdate}
            onClose={onPaneClick}
            onNodeDelete={onNodeDelete}
          />
        );
      // Add cases for other node types as needed
      // case "imageMessage":
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex font-sans text-gray-800">
      <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
        <header className="bg-gray-100 p-3 border-b border-gray-200 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save size={16} />
            Save Changes
          </button>
        </header>

        <main className="flex-grow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </main>
      </div>

      {selectedNode ? (
        renderSettingsPanel()
      ) : (
        <NodesPanel onDragStart={onDragStart} />
      )}
    </div>
  );
}
