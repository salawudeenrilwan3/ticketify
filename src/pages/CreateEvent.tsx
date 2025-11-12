import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { NumberInput, NumberInputField } from "@chakra-ui/number-input";
import {
  Box,
  Button,
  Input,
  Textarea,
  Stack,
  Heading,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type EventFormData = {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image?: FileList;
  organizer_id?: string;
  category: string;
};

// ✅ Define categories for Select
const categories = createListCollection({
  items: [
    { label: "Music", value: "music" },
    { label: "Sports", value: "sports" },
    { label: "Conference", value: "conference" },
    { label: "Other", value: "other" },
  ],
});

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    try {
      if (!user) throw new Error("Not authenticated");

      let imageUrl = "";

      if (data.image?.[0]) {
        const file = data.image[0];
        const filePath = `${user.id}/${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("events").insert([
        {
          title: data.title,
          description: data.description,
          date: data.date,
          location: data.location,
          price: data.price,
          image_url: imageUrl,
          organizer_id: user.id,
          category: data.category,
        },
      ]);

      if (error) throw error;

      alert("🎉 Event Created Successfully!");
      reset();
      navigate("/my-events");
    } catch (err: any) {
      console.error("❌ Error creating event:", err.message);
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      shadow="sm"
    >
      <Heading mb={6} size="lg">
        🎉 Create New Event
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={5}>
          {/* Title */}
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input placeholder="Event title" {...register("title")} />
          </FormControl>

          {/* ✅ Category (new Select API) */}
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select.Root
              collection={categories}
              size="sm"
              width="100%"
              onValueChange={(details) => {
                setValue("category", details.value as unknown as string); // ✅ sync with react-hook-form
              }}
            >
              <Select.HiddenSelect {...register("category")} />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select category" />
                </Select.Trigger>
                <Select.Indicator />
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {categories.items.map((cat) => (
                      <Select.Item item={cat} key={cat.value}>
                        {cat.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </FormControl>

          {/* Description */}
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              placeholder="Event description"
              {...register("description")}
            />
          </FormControl>

          {/* Date */}
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" {...register("date")} />
          </FormControl>

          {/* Location */}
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input placeholder="Event location" {...register("location")} />
          </FormControl>

          {/* Price */}
          <FormControl isRequired>
            <FormLabel>Price (€)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                {...register("price", { valueAsNumber: true })}
              />
            </NumberInput>
          </FormControl>

          {/* Image Upload */}
          <FormControl>
            <FormLabel>Event Image</FormLabel>
            <Input type="file" accept="image/*" {...register("image")} />
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            color="white"
            colorScheme="teal"
            size="lg"
            w="100%"
          >
            Create Event
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
