// src/pages/EventDetails.tsx
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import CheckoutModal from "../components/CheckoutModal";

type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  price: number;
};

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching event:", error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (!event) {
    return <Text>Event not found.</Text>;
  }

  return (
    <Box maxW="3xl" mx="auto" py={10}>
      {/* Banner */}
      <Image
        src={event.image_url}
        alt={event.title}
        borderRadius="lg"
        mb={6}
        objectFit="cover"
        w="100%"
        h="300px"
      />

      {/* Event Info */}
      <Stack gap={4}>
        <Heading>{event.title}</Heading>
        <Text color="gray.600">
          {event.location} • {new Date(event.date).toDateString()}
        </Text>
        <Text>{event.description}</Text>

        <Box borderBottom="1px" borderColor="gray.200" my={4} />

        <Text fontWeight="bold" fontSize="xl" color="brand.500">
          €{event.price}
        </Text>

        <Button
          colorScheme="brand"
          color="white"
          size="lg"
          w="100%"
          onClick={() => setOpen(true)}
        >
          Buy Ticket
        </Button>

        {/* Checkout Modal */}
        <CheckoutModal
          open={open}
          onClose={() => setOpen(false)}
          event={event}
        />
      </Stack>
    </Box>
  );
}
