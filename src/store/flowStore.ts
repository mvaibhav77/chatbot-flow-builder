import { create } from "zustand";
import {
  type Edge,
  type Node,
  type Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  reconnectEdge,
} from "@xyflow/react";

// The initial start node
const initialNodes: Node[] = [
  {
    id: "start-node",
    type: "startNode",
    position: { x: 250, y: 150 },
    data: {},
    deletable: false,
  },
];

// Define the state and actions for the flow store
type FlowState = {
  nodes: Node[];
  edges: Edge[];
  saveStatus: "success" | "error" | null;
  errorMessage: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onReconnect: (oldEdge: Edge, newConnection: Connection) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  saveFlow: () => void;
  loadFlow: () => void;
};

const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  saveStatus: null,
  errorMessage: null,

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // This handler is called when the user connects two nodes.
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    });
  },

  onReconnect: (oldEdge: Edge, newConnection: Connection) => {
    set({
      edges: reconnectEdge(oldEdge, newConnection, get().edges),
    });
  },

  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },

  setEdges: (edges: Edge[]) => {
    set({ edges });
  },

  saveFlow: () => {
    const { nodes, edges } = get();
    // Validation Logic to check if only one node has an empty target handle
    if (nodes.length > 1) {
      const targetNodeIds = new Set(edges.map((edge) => edge.target));
      const nodesWithEmptyTargets = nodes.filter(
        (node) => !targetNodeIds.has(node.id)
      );
      if (nodesWithEmptyTargets.length > 1) {
        set({
          saveStatus: "error",
          errorMessage:
            "Cannot save flow: More than one node has an empty target handle.",
        });
        setTimeout(() => set({ saveStatus: null, errorMessage: null }), 5000);
        return;
      }
    }
    // Save to localStorage
    localStorage.setItem("chatbot-flow", JSON.stringify({ nodes, edges }));
    set({ saveStatus: "success" });
    setTimeout(() => set({ saveStatus: null }), 3000);
  },

  loadFlow: () => {
    const flowData = localStorage.getItem("chatbot-flow");
    if (flowData) {
      const { nodes, edges } = JSON.parse(flowData);
      set({ nodes, edges });
    }
  },
}));

export default useFlowStore;
