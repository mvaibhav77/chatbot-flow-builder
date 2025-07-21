import type { NODE_TYPES } from "./constants";

export type NodeType = keyof typeof NODE_TYPES;
export type TextNodeData = {
  text: string;
};
