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
import BoardList from "./pages/board/BoardList";
import BoardDetail from "./pages/board/BoardDetail";
import Board from "./pages/board/Board";
import BoardModify from "./pages/board/BoardModify.";
import ErrorPage from "./pages/ErrorPage";

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
      {
        path: "board",
        element: <Board />,
        children: [
          {
            path: "",
            element: <BoardList />,
          },
          {
            path: "read/:boardId",
            element: <BoardDetail />,
          },
          {
            path: "modify/:boardId",
            element: <BoardModify />,
          },
        ],
      },
      {
        path: "errorPage",
        element: <ErrorPage />,
      },
    ],
    errorElement: <NotFound />,
  },
]);
