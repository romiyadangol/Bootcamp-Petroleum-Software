import React, { useState } from 'react';
import { Box, Flex, Button, Link as ChakraLink, useColorMode, useColorModeValue, Spacer, HStack, Image, VStack, textDecoration, Menu, MenuButton, MenuList, MenuItem, MenuGroup, MenuDivider } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';
import UserAvatar from './UserAvatar';

export default function Nav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  const handleLogout = () => {
    navigate('/logout');
  };

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
          <ChakraLink as = {RouterLink} to="/dashboard" _hover={{ textDecoration: 'none'}}>
            <Box fontWeight="bold" fontSize="20px" cursor='pointer'>
              Dashboard
            </Box>
          </ChakraLink> 

          <Spacer />

          <HStack as="nav" spacing={10}>
            <ChakraLink as={RouterLink} to="/dashboard/asset" _hover={{ textDecoration: 'none' }} fontSize="18px">Assets</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/products" _hover={{ textDecoration: 'none' }} fontSize="18px">Products</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/users" _hover={{ textDecoration: 'none' }} fontSize="18px">Users</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/drivers" _hover={{ textDecoration: 'none' }} fontSize="18px">Drivers</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/customers" _hover={{ textDecoration: 'none' }} fontSize="18px">Customers</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/customersBranch" _hover={{ textDecoration: 'none' }} fontSize="18px">Customers Branch</ChakraLink>
            <ChakraLink as={RouterLink} to="/dashboard/delivery" _hover={{ textDecoration: 'none' }} fontSize="18px">Delivery</ChakraLink>
          </HStack>

          <Spacer />

          <Box position="relative">
            <Menu>
              <MenuButton as={Button} colorScheme="none">
                <UserAvatar />
              </MenuButton>
              <MenuList>
                <MenuGroup title="Profile">
                  <MenuItem as={RouterLink} to="/edit-profile" style={{ fontSize: '19px'}}>
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', fontSize: '19px' }} />
                    Profile
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem as="button" onClick={handleLogout} style={{ fontSize: '19px'}}>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px', fontSize: '19px' }} />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Button onClick={toggleColorMode} color="orange.400">
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>
      </Box>

    </>
  );
}
