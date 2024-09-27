import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Nav from "./components/Nav";
import "./App.css";
import ProductList from "./components/products/ProductList";
import DriverLists from "./components/drivers/DriverLists";
import AssetLists from "./components/assets/AssetLists";
import DeliveryList from "./components/deliveries/DeliveryList";
import CustomerLists from "./components/customers/CustomerLists";
import CustomerBranchList from "./components/customersBranch/CustomerBranchList";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import CategoryList from "./components/categories/CategoryList";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { ROUTES } from "./constants/routes";

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
      path: ROUTES.LOGIN,
      element: <Login />,
    },
    {
      path: ROUTES.LOGOUT,
      element: <Logout />,
    },
    {
      path: ROUTES.DASHBOARD,
      element: (
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: ROUTES.PRODUCTS,
          element: <ProductList />,
        },
        {
          path: ROUTES.DRIVERS,
          element: <DriverLists />,
        },
        {
          path: ROUTES.ASSETS,
          element: <AssetLists />,
        },
        {
          path: ROUTES.CUSTOMERS,
          element: <CustomerLists />,
        },
        {
          path: ROUTES.CUSTOMERS_BRANCH,
          element: <CustomerBranchList />,
        },
        {
          path: ROUTES.DELIVERIES,
          element: <DeliveryList />,
        },
        {
          path: ROUTES.CATEGORIES,
          element: <CategoryList />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
