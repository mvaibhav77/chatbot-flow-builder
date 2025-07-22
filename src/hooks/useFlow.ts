// The useFlow hook encapsulates all logic related to the flow builder.
import { useState, useRef, useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";
import { NODE_TYPES } from "../utils/constants";
import type { AppNodeData, NodeType } from "../utils/types";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export function useFlow() {
  // most logic here I have taken from the official reactflow example
  // and modified it to fit the app need
  // https://reactflow.dev/learn
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((currentEdges) => {
        // Check if the source node of the new connection already has an outgoing edge.
        const sourceHasEdge = currentEdges.some(
          (edge) => edge.source === params.source
        );

        // If the source node is already connected, do not add the new edge.
        // Simply return the existing edges array.
        if (sourceHasEdge) {
          console.warn(
            `Node ${params.source} already has an outgoing connection.`
          );
          return currentEdges;
        }

        // If the source node is not yet connected, add the new edge.
        return addEdge(params, currentEdges);
      });
    },
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
      // Get the type of node being dragged from the dataTransfer object
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

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
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
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      // Optionally, we can also update the selected node if it matches
      // setSelectedNode((prevNode) =>
      //   prevNode && prevNode.id === nodeId
      //     ? { ...prevNode, data: { ...prevNode.data, ...data } }
      //     : prevNode
      // );
      setSelectedNode(null); // Deselect after updating
    },
    [setNodes]
  );

  const onNodeDelete = useCallback(
    (nodeId: string) => {
      // Manually filter the nodes and edges to remove the deleted one
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      setSelectedNode(null); // Deselect after deleting
    },
    [setNodes, setEdges]
  );

  // Return all the state and handlers that the UI component will need
  return {
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
  };
}
