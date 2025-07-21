// src/components/panels/SettingsPanel.tsx
import { ArrowLeft } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { TextNodeData } from "../../utils/types";

interface SettingsPanelProps {
  selectedNode: Node<TextNodeData>;
  onNodeUpdate: (nodeId: string, data: Partial<TextNodeData>) => void;
  onClose: () => void;
}

export function SettingsPanel({
  selectedNode,
  onNodeUpdate,
  onClose,
}: SettingsPanelProps) {
  const { data, id } = selectedNode;

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNodeUpdate(id, { text: event.target.value });
  };

  return (
    <aside className="w-80 border-l border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 pb-3 border-b-2">
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md">
          <ArrowLeft size={16} />
        </button>
        <h2 className="text-md font-semibold text-gray-700 flex-grow text-center">
          Message
        </h2>
      </div>

      <div className="pt-4">
        <label
          htmlFor="text-input"
          className="text-gray-500 text-sm mb-2 block"
        >
          Text
        </label>
        <textarea
          id="text-input"
          value={data.text}
          onChange={handleTextChange}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </aside>
  );
}
