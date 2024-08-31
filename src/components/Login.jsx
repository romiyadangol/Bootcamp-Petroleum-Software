import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/authActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom'; 
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
  HStack,
  Divider,
  Center,
  Spacer,
  Select
} from "@chakra-ui/react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate(); 

  const handleLogin = () => {
    dispatch(login(email, password, organization));
  };

  const handleSocialSignIn = (url) => {
    window.location.href = url;
  };

  useEffect(() => { 
    console.log('Auth state:', auth); 
    if (auth.isLoggedIn) { 
      navigate('/dashboard'); 
    }
  }, [auth.isLoggedIn, navigate]); 
  
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
          <FormControl id="organization">
            <FormLabel color="#fa6501">Organization</FormLabel>
            <Select
              placeholder="Select your organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
            >
              <option value="petroleum">Petroleum</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
            </Select>
          </FormControl>
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
          >
            Login
          </Button>
        </VStack>

        {/* Social Sign-In Section */}
        <Center mt="4">
          <Divider width="40%" />
          <Text mx="2">Or</Text>
          <Divider width="40%" />
        </Center>
        <Text mt="4">Sign in with:</Text>
        <HStack spacing="4" justify="center" mt="2">
          <Button
            colorScheme="gray"
            onClick={() => handleSocialSignIn("your-google-oauth-url")}
          >
            <FontAwesomeIcon icon={faGoogle} /> 
            <Spacer mr="1"/>
            Google
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => handleSocialSignIn("your-facebook-oauth-url")}
          >
            <FontAwesomeIcon icon={faFacebook} /> 
            <Spacer mr="1"/>
            Facebook
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => handleSocialSignIn("your-microsoft-oauth-url")}
          >
            <FontAwesomeIcon icon={faMicrosoft} /> 
            <Spacer mr="1"/>
            Microsoft
          </Button>
        </HStack>

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
