import { FlowBuilder } from "./components/FlowBuilder";
import "./index.css";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function App() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}

export default App;
