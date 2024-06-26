import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Join from "./pages/Join";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SearchEmail from "./pages/SearchEmail";
import SearchPass from "./pages/SearchPass";
import UserProfile from "./pages/userProfile/UserProfile";
import EditProfile from "./pages/userProfile/EditProfile";
import DeleteProfile from "./pages/userProfile/DeleteProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
        children: [
          {
            path: "searchEmail",
            element: <SearchEmail />,
          },
          {
            path: "searchPass",
            element: <SearchPass />,
          },
        ],
      },
      {
        path: "join",
        element: <Join />,
      },
      {
        path: "userProfile",
        element: <UserProfile />,
        children: [
          {
            path: "editProfile",
            element: <EditProfile />,
          },
          {
            path: "deleteProfile",
            element: <DeleteProfile />,
          },
        ],
      },
    ],
    errorElement: <NotFound />,
  },
]);
