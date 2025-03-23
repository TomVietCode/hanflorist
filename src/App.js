import { useRoutes } from "react-router-dom";
import combinedRoutes from "./router"; // File routes đã cập nhật
import { CartProvider } from "./Client/context/CartContext";

function App() {
  const elements = useRoutes(combinedRoutes);
  return <CartProvider>{elements}</CartProvider>;
}

export default App;