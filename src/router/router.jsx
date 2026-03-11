import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "../MainPage/Home.jsx";
import HardcoreToDo from "../MainPage/HardcoreToDo.jsx";
import SimpleToDo from "../MainPage/SimpleToDo.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/hardcore", element: <HardcoreToDo /> },
      { path: "/simple", element: <SimpleToDo /> },
    ],
  },
]);

export default router;