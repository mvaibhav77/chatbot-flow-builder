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
  reconnectEdge,
} from "@xyflow/react";
import { NODE_TYPES } from "../utils/constants";
import type { AppNodeData, NodeType } from "../utils/types";

const initialNodes: Node[] = [
  {
    id: 'start-node', // A fixed ID for our start node
    type: 'startNode',
    position: { x: 250, y: 150 }, // A default position on the canvas
    data: {},
    deletable: false, // This makes the node non-deletable
  },
];
const initialEdges: Edge[] = [];

export function useFlow() {
  // most logic here I have taken from the official reactflow example
  // and modified it to fit the app need
  // https://reactflow.dev/learn
  const edgeReconnectSuccessful = useRef(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // 2. Add the three new handlers for reconnecting/deleting edges
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
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

      const nodeData =
        type !== "startNode" ? NODE_TYPES[type].defaultData : {};

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
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

  const onEdgeUpdateEnd = useCallback(
    (_: MouseEvent, edge: Edge, isCancelled: boolean) => {
      // If the edge drop is cancelled (i.e., dropped onto the pane), delete the edge.
      if (isCancelled) {
        setEdges((currentEdges) =>
          currentEdges.filter((e) => e.id !== edge.id)
        );
      }
    },
    [setEdges]
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
    onEdgeUpdateEnd,
    onReconnectStart,
    onReconnect,
    onReconnectEnd,
  };
}
