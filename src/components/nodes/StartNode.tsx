import { Handle, Position, type NodeProps } from "@xyflow/react";

export function StartNode({ selected }: NodeProps) {
  return (
    <div
      className={`
        bg-white border-2 rounded-full shadow-md w-32 h-32
        flex items-center justify-center
        ${selected ? "border-green-500" : "border-gray-300"}
      `}
    >
      {/* This node has NO target handle, so it cannot be connected to */}

      <div className="flex flex-col items-center gap-1 text-green-600">
        <span className="text-lg font-semibold">Start</span>
      </div>

      {/* This source handle is not limited to one connection */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-4 !h-4 !bg-gray-400"
      />
    </div>
  );
}
