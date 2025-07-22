import { NODE_TYPES } from "../../utils/constants";
import type { NodeType } from "../../utils/types";

interface NodesPanelProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

export function NodesPanel({ onDragStart }: NodesPanelProps) {
  return (
    <aside className="w-80 border-l border-gray-200 bg-white">
      <div className="space-y-2">
        <div className="flex items-center bg-gray-100 p-3 border-b border-gray-200">
          <h2 className="text-xl p-1.5 font-semibold flex-grow">Nodes</h2>
        </div>

        {/* Map over the NODE_TYPES to render each draggable node item */}
        {Object.values(NODE_TYPES)
          .filter((nodeConfig) => nodeConfig.isPanelNode)
          .map((nodeConfig) => {
            const Icon = nodeConfig.icon;

            return (
              <div key={nodeConfig.type} className="p-4">
                <div
                  key={nodeConfig.type}
                  className="flex flex-col items-center gap-1 p-3 border-2 border-blue-500 rounded-md cursor-grab hover:bg-blue-50 transition-colors duration-200"
                  draggable
                  onDragStart={(event) =>
                    onDragStart(event, nodeConfig.type as NodeType)
                  }
                >
                  <Icon size={24} className="text-blue-600" />
                  <div className="font-medium text-gray-800">
                    {nodeConfig.label}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </aside>
  );
}
