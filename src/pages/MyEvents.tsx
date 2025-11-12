import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Button,
  HStack,
} from "@chakra-ui/react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image_url: string;
};

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error.message);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("organizer_id", user?.id);

    if (error) {
      alert("Error deleting event: " + error.message);
    } else {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      alert("🗑️ Event deleted");
    }
  };

  if (loading) return <Text>Loading events...</Text>;

  return (
    <Box maxW="800px" mx="auto" mt={10}>
      <Heading mb={6}>My Events</Heading>

      {events.length === 0 ? (
        <Text>
          No events created yet.{" "}
          <RouterLink to="/create-event">
            <Button size="sm" ml={2}>
              Create one
            </Button>
          </RouterLink>
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {events.map((event) => (
            <Box
              key={event.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
            >
              {event.image_url && (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
              )}
              <Box p={4}>
                <Heading size="md" mb={2}>
                  {event.title}
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
                <Text mt={2}>{event.description}</Text>
                <Text mt={2} fontWeight="bold">
                  €{event.price}
                </Text>
                <Text mt={1} fontStyle="italic">
                  {event.location}
                </Text>

                {/* Buttons */}
                <HStack mt={4} gap={4}>
                  <Button
                    size="sm"
                    color="white"
                    colorScheme="blue"
                    onClick={() =>
                      navigate(`/organizer/edit-event/${event.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    color="white"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default MyEvents;
