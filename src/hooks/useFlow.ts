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

  // UI interaction handlers

  // This handler is called when the user starts reconnecting an edge.
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  // This handler is called when the user successfully reconnects an edge.
  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges(edges.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [setEdges, edges]
  );

  // This handler is called when the user drags an item over the flow area.
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // This handler is called when the user drops an item onto the flow area.
  // It creates a new node based on the type of the dragged item.
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

  // This handler is called when the user starts dragging an item.
  // It sets the data to be transferred during the drag operation.
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

  // This handler is called when the user updates a node's data.
  // It updates the node's data in the store.
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

  // This handler is called when the user deletes a node.
  // It removes the node and its associated edges from the store.
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
    onSave: saveFlow,
  };
}
