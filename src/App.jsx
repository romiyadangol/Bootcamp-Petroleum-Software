import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Nav from "./components/Nav";
import "./App.css";
import ProductListPage from "../src/features/products/pages/ProductListPage";
import DriverLists from "./components/drivers/DriverLists";
import AssetListPage from "../src/features/assets/pages/AssetListPage";
import DeliveryList from "./components/deliveries/DeliveryList";
import CustomerLists from "./components/customers/CustomerLists";
import CustomerBranchList from "./components/customersBranch/CustomerBranchList";
import Logout from "./components/Logout";
import Dashboard from "./components/Dashboard";
import CategoryList from "./components/categories/CategoryList";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { ROUTES } from "./constants/routes";

function MainLayout({ children }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}

function ProtectedLayout({ children }) {
  return (
    <PrivateRoute>
      <MainLayout>{children}</MainLayout>
    </PrivateRoute>
  );
}

function App() {
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
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.PRODUCTS,
      element: (
        <ProtectedLayout>
          <ProductListPage />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.DRIVERS,
      element: (
        <ProtectedLayout>
          <DriverLists />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.ASSETS,
      element: (
        <ProtectedLayout>
          <AssetListPage />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.CUSTOMERS,
      element: (
        <ProtectedLayout>
          <CustomerLists />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.CUSTOMERS_BRANCH,
      element: (
        <ProtectedLayout>
          <CustomerBranchList />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.DELIVERIES,
      element: (
        <ProtectedLayout>
          <DeliveryList />
        </ProtectedLayout>
      ),
    },
    {
      path: ROUTES.CATEGORIES,
      element: (
        <ProtectedLayout>
          <CategoryList />
        </ProtectedLayout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
