import React, { useState } from 'react';
import { Box, Flex, Button, Link as ChakraLink, useColorMode, useColorModeValue, Spacer, HStack, Image, VStack, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';

export default function Nav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');
  const profilePicture = "https://randomuser.me/api/portraits/men/19.jpg";

  const toggleDropdown = () => {
  setShowDropdown(!showDropdown);
}

return (
<>
  <Box bg={bg} px={4} color={color} w="100vw" fontSize={22}>
    <Flex h={16} alignItems={'center'}>
      <Image
        src={logo}
        alt="Logo"
        boxSize="40px"
        mr={4}
      />
      <Box fontWeight="bold" fontSize="20px">
        Dashboard</Box>

      <Spacer />

      <HStack as="nav" spacing={10}>
      <ChakraLink as={RouterLink} to="/dashboard/asset" _hover={{ textDecoration: 'none' }} fontSize="18px">Assets</ChakraLink>
      <ChakraLink as={RouterLink} to="/dashboard/products" _hover={{ textDecoration: 'none' }} fontSize="18px">Products</ChakraLink>
      <ChakraLink as={RouterLink} to="/dashboard/users" _hover={{ textDecoration: 'none' }} fontSize="18px">Users</ChakraLink>
      <ChakraLink as={RouterLink} to="/dashboard/drivers" _hover={{ textDecoration: 'none' }} fontSize="18px">Drivers</ChakraLink>
      </HStack>

      <Spacer />

      <Box position="relative">
        <Flex justify="flex-end" p={4}>
          <Image
            src={profilePicture}
            alt="Profile"
            boxSize="40px"
            borderRadius="full"
            cursor="pointer"
            onClick={toggleDropdown}
          />
        </Flex>

        {showDropdown && (
          <Box
            position="absolute"
            top="60px"
            right="10px"
            bg={bg}
            boxShadow="md"
            borderRadius="md"
            width="150px"
            zIndex={1}
          >
          <VStack align="stretch" spacing={2} p={2}>
            <Flex align="center" px={2}>
              <FontAwesomeIcon icon={faUser} />
              <ChakraLink as={RouterLink} to="/edit-profile" ml={2} _hover={{ color: 'orange.500' }} fontSize="20px">Profile</ChakraLink>
            </Flex>
            <Flex align="center" px={2}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <ChakraLink as={RouterLink} to="/logout" ml={2} _hover={{ color: 'orange.500' }} fontSize="20px">Logout</ChakraLink>
            </Flex>
          </VStack>
          </Box>
        )}
      </Box>

      <Button onClick={toggleColorMode} color="orange.400">
        {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      </Button>   
    </Flex>
  </Box>
</>
);
}
