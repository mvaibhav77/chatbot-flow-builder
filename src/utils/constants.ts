import { MessageSquare } from "lucide-react";

export const NODE_TYPES = {
  textMessage: {
    label: "Message",
    type: "textMessage",
    icon: MessageSquare,
    description: "Send a text message",
    defaultData: { text: "New message" },
  },
  // Future node types can be added here
} as const;
