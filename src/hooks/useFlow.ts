// The useFlow hook encapsulates all logic related to the flow builder.
import { useState, useRef, useCallback, useEffect } from "react";
import { type Edge, type Node, type ReactFlowInstance } from "@xyflow/react";
import useFlowStore from "../store/flowStore"; // <-- Import the store
import { NODE_TYPES } from "../utils/constants";
import type { AppNodeData, NodeType } from "../utils/types";

export function useFlow() {
  // Select all state and actions from the Zustand store
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onReconnect,
    saveFlow,
    loadFlow,
    setNodes,
    setEdges,
    saveStatus,
    errorMessage,
  } = useFlowStore();

  const edgeReconnectSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Load the flow from localStorage when the component mounts
  useEffect(() => {
    loadFlow();
  }, [loadFlow]);

  // Handlers that are still needed for UI interaction
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges(edges.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges, edges]
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

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: NODE_TYPES[type].defaultData,
      };

      setNodes([...nodes, newNode]); // Add node via the store action
    },
    [reactFlowInstance, setNodes, nodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeUpdate = useCallback(
    (nodeId: string, data: Partial<AppNodeData>) => {
      setNodes(
        nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      setSelectedNode(null);
    },
    [nodes, setNodes]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes(nodes.filter((node) => node.id !== nodeId));
      setEdges(
        edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      setSelectedNode(null);
    },
    [nodes, edges, setNodes, setEdges]
  );

  return {
    reactFlowWrapper,
    nodes,
    edges,
    selectedNode,
    saveStatus,
    errorMessage,
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
    onReconnectStart,
    onReconnect,
    onReconnectEnd,
    onSave: saveFlow, // Expose the save function from the store
  };
}
