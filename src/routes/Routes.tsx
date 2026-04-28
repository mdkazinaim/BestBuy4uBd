import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import Form from "@/pages/Form";
import { adminRoutes } from "./AdminRoutes";
import { publicRoutes } from "./PublicRoutes";
import NotFound from "@/pages/NotFound";
import { routesGenerator } from "@/utils/Generator/RoutesGenerator";
import DashboardLayout from "@/Layout/DashboardLayout/DashboardLayout";
import LandingPageContainer from "@/pages/LandingPage/LandingPageContainer";
import { userRoutes } from "./UserRoutes";

import ProtectedRoute from "./ProtectedRoute";

import SharedLayout from "@/components/common/SharedLayout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          ...routesGenerator(publicRoutes),
          {
            path: "/form",
            element: <Form />,
          },
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/signup",
            element: <Signup />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...routesGenerator(adminRoutes),
        ],
      },
      {
        path: "/user",
        element: (
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          ...routesGenerator(userRoutes),
        ],
      },
      {
        path: "/:id",
        element: <LandingPageContainer />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default routes;
