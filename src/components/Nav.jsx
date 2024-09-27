import {
  Box,
  Flex,
  Button,
  Link as ChakraLink,
  useColorMode,
  useColorModeValue,
  Spacer,
  HStack,
  Image,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png";
import UserAvatar from "./UserAvatar";
import { ROUTES } from "../constants/routes";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    navigate(ROUTES.LOGOUT);
  };

  const NavLink = ({ to, children }) => (
    <ChakraLink
      as={RouterLink}
      to={to}
      _hover={{ textDecoration: "none" }}
      fontSize={{ base: "16px", md: "18px" }}
      display="block"
      mb={{ base: 2, md: 0 }}
    >
      {children}
    </ChakraLink>
  );

  const NavLinks = () => (
    <>
      <NavLink to={ROUTES.ASSETS}>Assets</NavLink>
      <NavLink to={ROUTES.PRODUCTS}>Products</NavLink>
      <NavLink to={ROUTES.CATEGORIES}>Category</NavLink>
      <NavLink to={ROUTES.DRIVERS}>Drivers</NavLink>
      <NavLink to={ROUTES.CUSTOMERS}>Customers</NavLink>
      <NavLink to={ROUTES.DELIVERIES}>Orders</NavLink>
    </>
  );

  return (
    <Box bg={bg} px={4} color={color} w="100%" fontSize={22}>
      <Flex h={16} alignItems="center">
        <Image src={logo} alt="Logo" boxSize="40px" mr={4} />
        <ChakraLink
          as={RouterLink}
          to="/dashboard"
          _hover={{ textDecoration: "none" }}
        >
          <Box fontWeight="bold" fontSize="20px" cursor="pointer">
            Dashboard
          </Box>
        </ChakraLink>

        <Spacer />

        <HStack as="nav" spacing={10} display={{ base: "none", md: "flex" }}>
          <NavLinks />
        </HStack>

        <Spacer />

        <HStack>
          <Box position="relative">
            <Menu>
              <MenuButton as={Button} colorScheme="none">
                <UserAvatar />
              </MenuButton>
              <MenuList>
                <MenuGroup title="Profile">
                  <MenuItem as={RouterLink} to="/edit-profile" fontSize="16px">
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ marginRight: "8px", fontSize: "16px" }}
                    />
                    Profile
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem as="button" onClick={handleLogout} fontSize="16px">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{ marginRight: "8px", fontSize: "16px" }}
                  />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>

          <Button onClick={toggleColorMode} color="orange.400">
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>

          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
          />
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <NavLinks />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
