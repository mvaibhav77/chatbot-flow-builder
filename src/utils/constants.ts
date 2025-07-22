import { MessageSquare, PlayIcon } from "lucide-react";

export const NODE_TYPES = {
  startNode: {
    label: "Start",
    type: "startNode",
    icon: PlayIcon,
    description: "The starting point of the flow",
    defaultData: {},
    isPanelNode: false,
  },
  textMessage: {
    label: "Message",
    type: "textMessage",
    icon: MessageSquare,
    description: "Send a text message",
    defaultData: { text: "New message" },
    isPanelNode: true,
  },

  // Future node types can be added here
} as const;
