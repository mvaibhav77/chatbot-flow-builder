// src/components/FlowBuilder.tsx
import { useState, useRef, useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node, // <-- Keep this generic Node type
  type ReactFlowInstance,
} from "@xyflow/react";
import { Save } from "lucide-react";

import { NodesPanel } from "./panels/NodesPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { NODE_TYPES } from "../utils/constants";
import type { NodeType, TextNodeData } from "../utils/types";
import { TextNode } from "./nodes/TextNode"; // <-- Import TextNodeData

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Define the custom node types
const nodeTypes = {
  textMessage: TextNode,
};

export function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // **THE FIX**: Specify that the selectedNode state holds a Node with TextNodeData
  const [selectedNode, setSelectedNode] = useState<Node<TextNodeData> | null>(
    null
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeType;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Be specific that this new node contains TextNodeData
      const newNode: Node<TextNodeData> = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: NODE_TYPES[type].defaultData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<TextNodeData>);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeUpdate = useCallback(
    (nodeId: string, data: Partial<TextNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      // Updating the selected node to reflect changes immediately in the panel
      setSelectedNode((prevNode) => {
        if (prevNode && prevNode.id === nodeId) {
          return { ...prevNode, data: { ...prevNode.data, ...data } };
        }
        return prevNode;
      });
    },
    [setNodes]
  );

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
        <SettingsPanel
          selectedNode={selectedNode}
          onNodeUpdate={onNodeUpdate}
          onClose={onPaneClick}
        />
      ) : (
        <NodesPanel onDragStart={onDragStart} />
      )}
    </div>
  );
}
