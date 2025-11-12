import {
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  Spinner,
  Image,
  Select,
  Portal,
  createListCollection,
  // ✅ import Select
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image_url: string;
  category: string; // ✅ add category
};

export default function EditEvent() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !user) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .eq("organizer_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching event:", error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id, user]);

  const handleUpdate = async () => {
    if (!event || !id) return;

    let imageUrl = event.image_url;

    // ✅ If new image selected, upload to Supabase
    if (newImage && user) {
      const filePath = `${user.id}/${Date.now()}_${newImage.name}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, newImage, { upsert: true });

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // ✅ Update event (including category)
    const { error } = await supabase
      .from("events")
      .update({
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        price: event.price,
        image_url: imageUrl,
        category: event.category, // ✅ include category
      })
      .eq("id", id)
      .eq("organizer_id", user?.id);

    if (error) {
      alert("Error updating event: " + error.message);
    } else {
      alert("✅ Event updated successfully!");
      navigate("/organizer/my-events");
    }
  };

  if (loading) {
    return (
      <Box p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!event) {
    return <Box p={8}>Event not found.</Box>;
  }

  const categories = createListCollection({
    items: [
      { label: "Music", value: "music" },
      { label: "Sports", value: "sports" },
      { label: "Conferences", value: "conferences" },
    ],
  });

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <Heading mb={6}>Edit Event</Heading>

      <FormControl mb={4}>
        <FormLabel>Title</FormLabel>
        <Input
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Date</FormLabel>
        <Input
          type="date"
          value={event.date?.split("T")[0]} // format yyyy-mm-dd
          onChange={(e) => setEvent({ ...event, date: e.target.value })}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Location</FormLabel>
        <Input
          value={event.location}
          onChange={(e) => setEvent({ ...event, location: e.target.value })}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Price (€)</FormLabel>
        <Input
          type="number"
          value={event.price}
          onChange={(e) =>
            setEvent({ ...event, price: Number(e.target.value) })
          }
        />
      </FormControl>

      {/* ✅ Category Select */}
      <FormControl mb={4}>
        <FormLabel>Category</FormLabel>
        <Select.Root
          collection={categories}
          value={event.category ? [event.category] : []} // controlled
          onValueChange={(details) =>
            setEvent({ ...event, category: details.value[0] })
          }
        >
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select category" />
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
      </FormControl>

      {/* ✅ Image Section */}
      <FormControl mb={4}>
        <FormLabel>Current Image</FormLabel>
        {event.image_url && (
          <Image
            src={event.image_url}
            alt="Event Banner"
            borderRadius="md"
            mb={2}
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
        />
      </FormControl>

      <Button colorScheme="blue" color="white" onClick={handleUpdate}>
        Save Changes
      </Button>
    </Box>
  );
}
