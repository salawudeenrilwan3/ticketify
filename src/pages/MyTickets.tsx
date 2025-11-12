// src/pages/MyTickets.tsx
import { useEffect, useState } from "react";
import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { getMyTickets } from "../services/tickets";
import type { TicketWithEvent } from "../services/tickets";
import { generateTicketPDF } from "../utils/generateTicket";

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketWithEvent[]>([]);

  // Fetch tickets for the logged-in user
  useEffect(() => {
    if (user) {
      getMyTickets(user.id).then(setTickets);
    }
  }, [user]);

  // If user is not logged in
  if (!user) {
    return (
      <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={10}>
        <Text>Please sign in to view your tickets.</Text>
      </Box>
    );
  }

  return (
    <Box maxW="3xl" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <Heading mb={6}>🎟️ My Tickets</Heading>

      {tickets.length === 0 ? (
        <Text color="gray.600">You haven’t purchased any tickets yet.</Text>
      ) : (
        <VStack align="stretch" gap={6}>
          {tickets.map((ticket) => (
            <Box
              key={ticket.id}
              p={6}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              _hover={{ shadow: "md" }}
            >
              <Heading size="md" mb={2}>
                {ticket.event?.title}
              </Heading>
              <Text color="gray.600" mb={2}>
                {ticket.event?.location} •{" "}
                {ticket.event?.date
                  ? new Date(ticket.event.date).toDateString()
                  : "No date"}
              </Text>
              <Text fontWeight="bold" color="brand.500" mb={4}>
                €{ticket.event?.price}
              </Text>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Purchased: {new Date(ticket.purchased_at).toLocaleString()}
              </Text>
              <Button
                size="sm"
                colorScheme="brand"
                variant="outline"
                onClick={() =>
                  generateTicketPDF({
                    id: ticket.id,
                    title: ticket.event?.title || "Untitled Event",
                    location: ticket.event?.location || "Unknown",
                    date: ticket.event?.date || "",
                    price: ticket.event?.price || 0,
                  })
                }
              >
                Download Ticket
              </Button>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
