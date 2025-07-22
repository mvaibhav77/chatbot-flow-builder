# Chatbot Flow Builder

A visual flow builder for creating chatbot conversations using React Flow, built with React, TypeScript, and Tailwind CSS.

Hosted on:- https://chatbot-flow-builder-tool.vercel.app/

## Features

- **Visual Flow Editor**: Drag-and-drop interface for building chatbot flows
- **Node-Based Architecture**: Start nodes and message nodes with connection validation
- **Real-time Validation**: Prevents saving flows with invalid configurations
- **Local Storage**: Automatically saves and loads flows
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **React Flow** - Visual node editor
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Vite** - Build tool
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mvaibhav77/chatbot-flow-builder.git

# Navigate to project directory
cd chatbot-flow-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Usage

1. **Add Nodes**: Drag message nodes from the left panel into the canvas
2. **Connect Nodes**: Click and drag from source handles (right side) to target handles (left side)
3. **Edit Messages**: Click on any message node to edit its content in the settings panel
4. **Save Flow**: Click the "Save Changes" button to persist your flow
5. **Validation**: The app prevents saving flows with multiple unconnected nodes

## Project Structure

```
src/
├── components/
│   ├── nodes/          # Node components (StartNode, TextNode)
│   ├── panels/         # UI panels (NodesPanel, SettingsPanel)
│   └── FlowBuilder.tsx # Main flow editor component
├── hooks/
│   └── useFlow.ts      # Flow logic hook
├── store/
│   └── flowStore.ts    # Zustand store for state management
└── utils/
    ├── constants.ts    # Node type definitions
    └── types.ts       # TypeScript type definitions
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
