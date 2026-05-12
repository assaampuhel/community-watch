import AuthForm from "./components/Authform";
import HomePage from "./components/HomePage";
import ActiveReports from "./components/ActiveReports";
import CheaterDB from "./components/CheaterDB";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth",
    element: <AuthForm />,
  },
  {
    path: "/reports",
    element: <ActiveReports />,
  },
  {
    path: "/cheaters",
    element: <CheaterDB />,
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;