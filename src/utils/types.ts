import type { NODE_TYPES } from "./constants";

export type NodeType = keyof typeof NODE_TYPES;

export type TextNodeData = {
  text: string;
};

// A union type for all possible data properties on our nodes.
// When we add an ImageNode, we'll add its data type here like:
// export type AppNodeData = TextNodeData | ImageNodeData;
export type AppNodeData = TextNodeData;