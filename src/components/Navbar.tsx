import {
  Flex,
  Box,
  Image,
  Button,
  IconButton,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { Collapse } from "@chakra-ui/transition";
import { Menu as HamburgerIcon, X as CloseIcon } from "lucide-react";
import logo from "/src/assets/logo.svg";
import SearchInput from "./SearchInput";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { open, onToggle } = useDisclosure();

  return (
    <Box
      as="nav"
      bg="gray.900"
      color="white"
      px={4}
      py={3}
      position="sticky"
      top="0"
      zIndex="999"
      boxShadow="md"
    >
      <Flex align="center" justify="space-between" wrap="wrap">
        {/* Left: Logo */}
        <RouterLink to="/">
          <Image src={logo} boxSize="50px" cursor="pointer" />
        </RouterLink>

        {/* Mobile Hamburger Button */}
        <IconButton
          aria-label="Toggle navigation"
          display={{ base: "block", md: "none" }}
          onClick={onToggle}
          variant="ghost"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          {open ? <CloseIcon color="white" /> : <HamburgerIcon color="white" />}
        </IconButton>

        {/* Middle: Search (hidden on small screens) */}
        <Box flex="1" mx="20px" display={{ base: "none", md: "block" }}>
          <SearchInput />
        </Box>

        {/* Desktop Navigation Buttons */}
        <Flex gap={3} align="center" display={{ base: "none", md: "flex" }}>
          {!user && (
            <>
              <RouterLink to="/login">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  Login
                </Button>
              </RouterLink>

              <RouterLink to="/register">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  Register
                </Button>
              </RouterLink>
            </>
          )}

          {user && role === "user" && (
            <>
              <RouterLink to="/my-tickets">
                <Button size="sm" bg="gray.600" _hover={{ bg: "gray.700" }}>
                  My Tickets
                </Button>
              </RouterLink>

              <RouterLink to="/profile">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  Profile
                </Button>
              </RouterLink>
            </>
          )}

          {user && role === "organizer" && (
            <>
              <RouterLink to="/dashboard">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  Dashboard
                </Button>
              </RouterLink>
              <RouterLink to="/my-events">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  My Events
                </Button>
              </RouterLink>
              <RouterLink to="/create-event">
                <Button size="sm" variant="outline" colorScheme="whiteAlpha">
                  Create Event
                </Button>
              </RouterLink>
            </>
          )}

          {user && (
            <Button size="sm" colorScheme="red" onClick={logout}>
              Logout
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={open} animateOpacity>
        <Box
          mt={3}
          display={{ md: "none" }}
          bg="gray.800"
          rounded="md"
          shadow="md"
          p={4}
        >
          <Stack gap={3}>
            <Box>
              <SearchInput />
            </Box>

            {!user && (
              <>
                <RouterLink to="/login">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    Login
                  </Button>
                </RouterLink>

                <RouterLink to="/register">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    Register
                  </Button>
                </RouterLink>
              </>
            )}

            {user && role === "user" && (
              <>
                <RouterLink to="/my-tickets">
                  <Button w="full" bg="gray.600" _hover={{ bg: "gray.700" }}>
                    My Tickets
                  </Button>
                </RouterLink>

                <RouterLink to="/profile">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    Profile
                  </Button>
                </RouterLink>
              </>
            )}

            {user && role === "organizer" && (
              <>
                <RouterLink to="/dashboard">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    Dashboard
                  </Button>
                </RouterLink>
                <RouterLink to="/my-events">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    My Events
                  </Button>
                </RouterLink>
                <RouterLink to="/create-event">
                  <Button w="full" variant="outline" colorScheme="whiteAlpha">
                    Create Event
                  </Button>
                </RouterLink>
              </>
            )}

            {user && (
              <Button w="full" colorScheme="red" onClick={logout}>
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Navbar;
