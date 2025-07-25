import { ReactFlow, Controls, Background, type Node } from "@xyflow/react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";

import { useFlow } from "../hooks/useFlow"; // <-- Import the custom hook
import { NodesPanel } from "./panels/NodesPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { TextNode } from "./nodes/TextNode";
import type { TextNodeData } from "../utils/types";
import { StartNode } from "./nodes/StartNode";

// Define the custom node types. This can stay here as it's UI-related.
const nodeTypes = {
  textMessage: TextNode,
  startNode: StartNode,
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
    onNodeDelete,
    onReconnect,
    onReconnectStart,
    onReconnectEnd,
    onSave,
    saveStatus,
    errorMessage,
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
        <header className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
          {/* Container for the notification messages */}
          <div className="flex-grow text-center">
            {saveStatus === "error" && (
              <div className="inline-flex items-center gap-2 text-red-600 bg-red-100 px-4 py-2 rounded-md">
                <AlertCircle size={16} />
                {errorMessage}
              </div>
            )}
            {saveStatus === "success" && (
              <div className="inline-flex items-center gap-2 text-green-600 bg-green-100 px-4 py-2 rounded-md">
                <CheckCircle2 size={16} />
                Flow Saved Successfully!
              </div>
            )}
          </div>

          <button
            onClick={onSave}
            className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
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
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
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

      {/* Left Panel for Nodes */}
      {selectedNode && selectedNode.type !== "startNode" ? (
        renderSettingsPanel()
      ) : (
        <NodesPanel onDragStart={onDragStart} />
      )}
    </div>
  );
}
