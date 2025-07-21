import { useState, useEffect } from "react"; // <-- Import hooks
import { Check, MoveLeft, Trash } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { TextNodeData } from "../../utils/types";

interface SettingsPanelProps {
  selectedNode: Node<TextNodeData>;
  onNodeUpdate: (nodeId: string, data: Partial<TextNodeData>) => void;
  onClose: () => void;
  onNodeDelete: (nodeId: string) => void;
}

export function SettingsPanel({
  selectedNode,
  onNodeUpdate,
  onClose,
  onNodeDelete,
}: SettingsPanelProps) {
  const { data, id } = selectedNode;

  // 1. Local state to manage the input value independently.
  const [localText, setLocalText] = useState(data.text);

  // 2. useEffect to sync local state if the selected node changes.
  // This ensures that when you click a different node, the panel shows the new node's text.
  useEffect(() => {
    setLocalText(data.text);
  }, [id, data.text]); // Re-run when the node ID or its text changes.

  const handleApplyChanges = () => {
    onNodeUpdate(id, { text: localText });
  };

  const handleDeleteNode = () => {
    onNodeDelete(id);
  };

  return (
    <aside className="w-80 border-l border-gray-200 bg-white flex flex-col">
      <div className="flex items-center gap-2 pb-3 bg-neutral-100 border-b border-gray-200 p-4">
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md">
          <MoveLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-700 flex-grow truncate text-center">
          Message
        </h2>
      </div>

      <div className="flex-grow p-4">
        <label
          htmlFor="text-input"
          className="text-gray-500 text-sm mb-2 block"
        >
          Text
        </label>
        <textarea
          id="text-input"
          value={localText} // 3. The textarea is now controlled by our local state.
          onChange={(e) => setLocalText(e.target.value)}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4 p-4 flex flex-col gap-2 items-center justify-center">
        <button
          onClick={handleApplyChanges} // 4. This button now triggers the update.
          className="cursor-pointer px-4 py-2 w-full bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
        >
          <Check size={20} />
          Apply Changes
        </button>

        <button
          onClick={handleDeleteNode} // 5. This button deletes the node.
          className="cursor-pointer px-4 py-2 w-full bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
        >
          <Trash size={20} />
          Delete Node
        </button>
      </div>
    </aside>
  );
}
