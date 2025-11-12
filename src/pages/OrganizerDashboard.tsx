import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useOrganizerStats from "../hooks/useOrganizerStats";

export default function OrganizerDashboard() {
  const { totalEvents, ticketsSold, totalRevenue, perEvent } =
    useOrganizerStats();

  return (
    <Flex h="100vh">
      {/* Sidebar */}

      {/* Main Content */}
      <Box flex="1" p={8} overflowY="auto">
        <Heading mb={6} color="white">
          Dashboard Overview
        </Heading>

        {/* Top stats */}
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
          <Stat.Root
            p={6}
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
          >
            <Stat.Label>Total Events</Stat.Label>
            <Stat.ValueText color="white">{totalEvents}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root
            p={6}
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
          >
            <Stat.Label>Tickets Sold</Stat.Label>
            <Stat.ValueText color="white">{ticketsSold}</Stat.ValueText>
          </Stat.Root>

          <Stat.Root
            p={6}
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
          >
            <Stat.Label>Revenue</Stat.Label>
            <Stat.ValueText color="white">€{totalRevenue}</Stat.ValueText>
          </Stat.Root>
        </SimpleGrid>

        {/* Per-event breakdown */}
        <Heading size="md" mb={4} color={"white"}>
          Event Sales Breakdown
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {perEvent.map((event) => (
            <Box
              key={event.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
            >
              <Heading size="sm" color={"white"}>
                {event.title}
              </Heading>
              <Text color={"white"}>Tickets Sold: {event.ticketsSold}</Text>
              <Text color={"white"}>Revenue: €{event.revenue}</Text>
              <RouterLink to={`/organizer/edit-event/${event.id}`}>
                <Button size="sm" colorScheme="blue" mt={2} color={"white"}>
                  Edit Event
                </Button>
              </RouterLink>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
