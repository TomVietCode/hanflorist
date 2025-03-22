import { useRoutes } from "react-router-dom";
import combinedRoutes from "./router"; // Import routes tổng hợp

function App() {
  const elements = useRoutes(combinedRoutes);
  return <>{elements}</>; // Trả về elements trong một fragment
}

export default App;