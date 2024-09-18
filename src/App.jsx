import React, { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Nav from "./components/Nav";
import "./App.css";
import ProductList from "./components/products/ProductList";
import DriverLists from "./components/drivers/DriverLists";
import AssetLists from "./components/asset/AssetLists";
import DeliveryList from "./components/delivery/DeliveryList";
import CustomerLists from "./components/customers/CustomerLists";
import CustomerBranchList from "./components/customerBranch/CustomerBranchList";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import CategoryList from "./components/category/CategoryList";

function App() {
  const MainLayout = () => {
    return (
      <div>
        <Nav />
        <Outlet />
      </div>
    );
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/dashboard",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "products",
          element: <ProductList />,
        },
        // {
        //   path: "users",
        //   element: <UserLists />,
        // },
        {
          path: "drivers",
          element: <DriverLists />,
        },
        {
          path: "asset",
          element: <AssetLists />,
        },
        {
          path: "customers",
          element: <CustomerLists />,
        },
        {
          path: "customersBranch",
          element: <CustomerBranchList />,
        },
        {
          path: "delivery",
          element: <DeliveryList />,
        },
        {
          path: "category",
          element: <CategoryList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
