import clientRoutes from "./Client/routers"; // Router của client
import adminRoutes from "./admin/router";   // Router của admin

const combinedRoutes = [
  ...clientRoutes,  // Routes của client
  ...adminRoutes,   // Routes của admin
];

export default combinedRoutes;