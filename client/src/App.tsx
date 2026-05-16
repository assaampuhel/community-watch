import Authform from "./components/Authform";
import HomePage from "./components/HomePage";
import ActiveReports from "./components/ActiveReports";
import CheaterDB from "./components/CheaterDB";
import Navbar from "./components/Navbar";
import Report from "./components/Report";
import { AuthProvider } from "./context/AuthContext";

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// Layout component to share the Navbar across all main pages
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/reports",
        element: <ActiveReports />,
      },
      {
        path: "/cheaters",
        element: <CheaterDB />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/auth",
        element: <Authform />,
      },
    ]
  },
]);



function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;