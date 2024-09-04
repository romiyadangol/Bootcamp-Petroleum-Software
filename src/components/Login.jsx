import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginUserSuccess, loginUserFailure } from "../redux/actions/authActions";
import { useNavigate } from 'react-router-dom'; 
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutation/login';
import SecureLS from 'secure-ls';
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
} from "@chakra-ui/react";
import { storeToken } from "../helper/storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const ls = new SecureLS({ encodingType: 'aes' });

  const [login, { data, error, loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.userSession) {
        const { user, token, errors } = data.userSession;
        if (errors && errors.length > 0) {
          dispatch(loginUserFailure(errors));
          console.error('Login errors:', errors);
          return;
        }
        if (token) {
          try {
            storeToken(token);
            console.log('Token stored:', ls.get('authToken'));
          } catch (e) {
            console.error('Error storing token:', e);
          }
          dispatch(loginUserSuccess(user));
          setEmail("");
          setPassword("");
          navigate('/dashboard');
        }
      } else {
        console.error('No userSession data found');
      }
    },
    onError: (err) => {
      dispatch(loginUserFailure(err.message));
      console.error('Login error:', err);
    }
  });
  

  const handleLogin = () => {
    dispatch(loginUser()); 
    login({
      variables: {
        sessionInfo: {
          email,
          password,
        }
      }
    });
  };

  useEffect(() => { 
    if (auth.user) { 
      navigate('/dashboard'); 
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
        {auth.error && <Text color="red.500" mb="4">{auth.error}</Text>}
        <VStack spacing="4">
          {/* <FormControl id="organization">
            <FormLabel color="#fa6501">Organization</FormLabel>
            <Select
              placeholder="Select your organization"
              value={organization}
              color="gray"
              onChange={(e) => setOrganization(e.target.value)}
            >
              <option value="petroleum">Petroleum</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
            </Select>
          </FormControl> */}
          <FormControl id="email">
            <FormLabel color="#fa6501">Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel color="#fa6501">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="orange"
            width="100%"
            onClick={handleLogin}
            mt="4"
            background="#fa6501"
            isLoading={loading}
          >
            Login
          </Button>
        </VStack>

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
