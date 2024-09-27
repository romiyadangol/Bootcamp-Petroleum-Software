import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginUserSuccess,
  loginUserFailure,
} from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutation/login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import SecureLS from "secure-ls";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Link,
  VStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { storeToken } from "../helper/storage";
import { ROUTES } from "../constants/routes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const ls = new SecureLS({ encodingType: "aes" });

  const [login, { error, loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      const { user, token, errors } = data.userSession || {};

      if (errors && errors.length > 0) {
        dispatch(loginUserFailure(errors));
        return;
      }

      if ((token, user.roles)) {
        try {
          const secureUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          };
          ls.set("loggedInUser", secureUser);

          storeToken(token, user.roles);

          dispatch(loginUserSuccess(user));
          setEmail("");
          setPassword("");
          navigate("/dashboard");
        } catch (error) {
          console.error("Error storing token:", error);
          dispatch(loginUserFailure("Failed to store token."));
        }
      } else {
        dispatch(loginUserFailure("Invalid login credentials."));
      }
    },
    onError: (err) => {
      dispatch(loginUserFailure(err.message));
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(loginUserFailure("Please fill in both email and password."));
      return;
    }
    dispatch(loginUser());
    login({
      variables: {
        sessionInfo: {
          email,
          password,
        },
      },
    });
  };

  useEffect(() => {
    if (auth.user) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [auth.user, navigate]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#2B2D30"
      color="white"
    >
      <Box
        w="400px"
        p="8"
        bg="#232428"
        borderRadius="md"
        boxShadow="lg"
        textAlign="center"
      >
        <Heading as="h2" size="lg" mb="6" color="#fa6501">
          Login
        </Heading>

        {auth.error && (
          <Text color="red.500" mb="4">
            {auth.error}
          </Text>
        )}
        {error && (
          <Text color="red.500" mb="4">
            {error.message}
          </Text>
        )}

        <form onSubmit={handleLogin}>
          <VStack spacing="4">
            <FormControl id="email" isRequired>
              <FormLabel color="#fa6501">Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>

            <FormControl id="password" isRequired mt={4}>
              <FormLabel color="#fa6501">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    ) : (
                      <FontAwesomeIcon icon={faEye} />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="orange"
              width="100%"
              mt="4"
              background="#fa6501"
              isLoading={loading}
              isDisabled={loading}
            >
              Login
            </Button>
          </VStack>
        </form>

        <Box mt="6">
          <Link href="/forgot-password" color="#fa6501">
            Forgot Password?
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
