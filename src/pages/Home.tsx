import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import EventCard from "../components/EventCard";
import { supabase } from "../services/supabaseClient";

type Event = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  price: number;
  category?: string;
};

const categories = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "Music", value: "music" },
    { label: "Sports", value: "sports" },
    { label: "Conference", value: "conferences" },
  ],
});

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");

      if (error) {
        console.error("❌ Error fetching events:", error.message);
      } else {
        setEvents(data || []);
      }

      setLoading(false);
    };

    fetchEvents();
  }, []);

  // ✅ Filter events by category
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <Box px={{ base: 4, md: 8, lg: 16 }} py={10} w="100%">
      <Heading mb={6}>Upcoming Events 🎟️</Heading>

      {/* Category Filter */}
      <Box mb={6} maxW="300px">
        <Select.Root
          collection={categories}
          value={[selectedCategory]}
          onValueChange={(details) => {
            if (details.value.length > 0) {
              setSelectedCategory(details.value[0]);
            }
          }}
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Filter by category" />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {categories.items.map((item) => (
                  <Select.Item item={item} key={item.value}>
                    {item.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Box>

      {loading ? (
        <Spinner size="xl" />
      ) : filteredEvents.length === 0 ? (
        <Text>No events found for this category.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
