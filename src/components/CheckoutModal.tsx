import { Dialog, Portal, Button, Text, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/number-input";
import { useAuth } from "../context/AuthContext";
import { purchaseTicket } from "../services/tickets";

interface Props {
  open: boolean;
  onClose: () => void;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
  };
}

export default function CheckoutModal({ open, onClose, event }: Props) {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    if (!user) {
      // redirect to login if not logged in
      window.location.href = "/login";
      return;
    }

    // ✅ Only allow users to purchase, not organizers
    if (user.role === "organizer") {
      alert("Organizers cannot purchase tickets.");
      return;
    }

    try {
      setLoading(true);
      await purchaseTicket(event.id, user.id, quantity); // purchase ticket
      setPurchased(true);

      // auto-close after 2 seconds
      setTimeout(() => {
        setPurchased(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Ticket purchase failed:", err);
      alert("Failed to purchase ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" position="fixed" inset="0" />
        <Dialog.Positioner>
          <Dialog.Content
            bg="white"
            borderRadius="md"
            maxW="400px"
            w="90%"
            p={6}
            shadow="2xl"
            _dark={{ bg: "gray.800" }}
          >
            {!purchased ? (
              <>
                <Dialog.Header mb={4}>
                  <Dialog.Title fontSize="xl" fontWeight="bold">
                    Checkout
                  </Dialog.Title>
                  <Dialog.CloseTrigger />
                </Dialog.Header>

                <Dialog.Body>
                  <Text fontWeight="bold">{event.title}</Text>
                  <Text>
                    {event.location} • {new Date(event.date).toDateString()}
                  </Text>
                  <Text mt={3} fontSize="lg" color="brand.500">
                    Price: €{event.price}
                  </Text>

                  <NumberInput
                    mt={4}
                    min={1}
                    max={10}
                    value={quantity}
                    onChange={(value) => setQuantity(Number(value))}
                  >
                    <NumberInputField />
                  </NumberInput>
                  <Text mt={2}>Quantity</Text>
                </Dialog.Body>

                <Dialog.Footer mt={6}>
                  <HStack justify="flex-end" w="100%" gap={3}>
                    <Button variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="brand"
                      color="white"
                      onClick={handlePurchase}
                      loading={loading}
                    >
                      Confirm Purchase
                    </Button>
                  </HStack>
                </Dialog.Footer>
              </>
            ) : (
              <VStack gap={3} textAlign="center" py={6}>
                <Text fontSize="2xl">🎉 Ticket Purchased!</Text>
                <Text color="gray.600">
                  Your {quantity} ticket(s) for <b>{event.title}</b> have been
                  saved.
                </Text>
              </VStack>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
