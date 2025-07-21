// src/components/nodes/TextNode.tsx
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import type { TextNodeData } from "../../utils/types";

// The component for our custom text node
export function TextNode({
  data,
  selected,
}: NodeProps & { data: TextNodeData }) {
  return (
    <div
      className={`
        bg-white border-2 rounded-lg shadow-md w-64
        ${selected ? "border-blue-500" : "border-gray-300"}
      `}
    >
      {/* Target Handle: This is the connection point for incoming edges.
        According to the requirements, it can have multiple connections.
      */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-gray-400"
      />

      {/* Node Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-teal-100 rounded-t-md">
        <MessageSquareText size={16} className="text-teal-700" />
        <span className="text-sm font-semibold text-teal-800">
          Send Message
        </span>
      </div>

      {/* Node Content */}
      <div className="p-3 bg-white rounded-b-md">
        <p className="text-sm text-gray-700 break-words">
          {data.text || "New message"}
        </p>
      </div>

      {/* Source Handle: This is the connection point for outgoing edges.
        It will be on the right side.
      */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-400"
      />
    </div>
  );
}
