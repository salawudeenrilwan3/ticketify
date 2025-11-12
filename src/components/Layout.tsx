import { Box } from "@chakra-ui/react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />

      {/* Full-width content wrapper */}
      <Box
        as="main"
        flex="1"
        w="100%"
        maxW="100%" // Make sure it spans full width
        px={{ base: 4, md: 8, lg: 16 }}
        py={6}
        mx="auto" // center the content if desired
      >
        {children}
      </Box>

      <Box
        as="footer"
        bg="gray.100"
        textAlign="center"
        py={4}
        color="gray.950"
        w="100%"
      >
        © {new Date().getFullYear()} Ticketify. All rights reserved.
      </Box>
    </Box>
  );
}
