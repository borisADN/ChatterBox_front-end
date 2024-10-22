import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Welcome from "./Pages/Welcome/Welcome";
import NotFound from "./Pages/NotFound/NotFound";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Users from "./Pages/Users/Users";
import Chat from "./Pages/ChatInterface/Chat";
import GroupChat from "./Pages/Group/Group";
import CreateGroup from "./Pages/CreateGroup/CreateGroup";
import GroupDetails from "./Pages/GroupDetails/GroupDetails";
import EditProfile from "./Pages/EditProfile/EditProfile";
import Forgot from "./Pages/Forgot/Forgot";
import OtpCode from "./Pages/OtpCode/OtpCode";
import NewPassword from "./Pages/NewPassword/NewPassword";

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
      path: "/chat",
      element: <Chat />
    },
    {
      path: "/group",
      element: <GroupChat />
    },
    {
      path: "/createGroup",
      element: <CreateGroup />
    },
    {
      path: "/GroupDetails/:groupId",
      element: <GroupDetails />
    },
    {
      path: "/addMember/:groupId",
     element: <Users />
    },
    {
      path: "/updateUser/:UserId",
     element: <EditProfile />
    },{
      path: "/forgottenPassword",
      element: <Forgot />
    },{
      path: "/VerifyOtp/:email",
      element: <OtpCode />
    },{
      path: "NewPassword/:email/:code",
      element: <NewPassword />
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
