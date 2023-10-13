import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "./routes/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import TeamSelect from "./routes/TeamSelect.jsx";
import teamStore from "./redux/teamStore.js";
import { Provider } from "react-redux";
import Running from "./routes/Running.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/teamselect",
    element: (
      <ProtectedRoute>
        <Navbar />
        <TeamSelect />
      </ProtectedRoute>
    ),
  },
  {
    path: "/running",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Running />
      </ProtectedRoute>
    ),
  },
  {
    path: "/*",
    element: <h2>{window.location}</h2>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={teamStore}>
    <RouterProvider router={router} />
  </Provider>
);
