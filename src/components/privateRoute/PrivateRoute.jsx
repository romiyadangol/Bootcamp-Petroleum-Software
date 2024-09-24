import { Navigate } from "react-router-dom";
import { getToken } from "../../helper/storage";

function PrivateRoute({ children }) {
  const isLoggedIn = getToken() ?? null;
  // const { isLoggedIn } = auth;
  console.log(isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
