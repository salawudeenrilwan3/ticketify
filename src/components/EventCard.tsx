import { Image, Heading, Text, Link, Flex, Spacer } from "@chakra-ui/react";

type EventCardProps = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date: string;
  location: string;
  price: number;
};

export default function EventCard({
  id,
  title,
  description,
  image_url,
  date,
  location,
  price,
}: EventCardProps) {
  return (
    <Link href={`/event/${id}`} _hover={{ textDecoration: "none" }} h="100%">
      <Flex
        direction="column"
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        h="100%" // ✅ makes card fill grid cell
      >
        <Image
          src={image_url}
          alt={title}
          height="200px"
          width="100%"
          objectFit="cover"
          borderTopRadius="lg"
        />

        <Flex direction="column" p={4} flex="1" minH={0}>
          <Heading fontSize="lg" mb={2}>
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {location} • {new Date(date).toDateString()}
          </Text>
          <Text mt={2}>{description}</Text>
          <Spacer /> {/* ✅ pushes price to the bottom */}
          <Text mt={3} fontWeight="bold" color="brand.500">
            €{price}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
}
