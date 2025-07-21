// src/utils/constants.ts
import { MessageSquare } from "lucide-react";

// Define available node types for easy extensibility
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


