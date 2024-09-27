import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUserSuccess } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "../graphql/mutation/logout";
import { removeToken } from "../helper/storage";
import { Box, Spinner, Text } from "@chakra-ui/react";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout, { error, loading }] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      try {
        removeToken();
        localStorage.removeItem("authToken");
      } catch (error) {
        console.error("Error removing token:", error);
      }
      dispatch(logoutUserSuccess());
      navigate("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  useEffect(() => {
    logout();
  }, [logout]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4} fontSize="lg" color="blue.500">
          Logging Out, please wait...
        </Text>
      </Box>
    );
  }
  if (error) return <p>Error logging out: {error.message}</p>;

  return null;
};

export default Logout;
