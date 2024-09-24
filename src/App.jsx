import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Welcome from "./Pages/Welcome/Welcome";
import NotFound from "./Pages/NotFound/NotFound";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Users/Users";
import ChatGpt from "./Pages/Users/ChatGpt";
import ChatInterface from "./Pages/Users/ChatGpt";
import Chat from "./Pages/ChatInterface/Chat";
import Chat2 from "./Pages/trial/Chat";

export default function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: "/all_users",
      element: <Users />
    },
    {
      path: "/trial",
      element: <Chat2 />
    },{
      path: "/chat",
      element: <Chat />
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]);
  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}
