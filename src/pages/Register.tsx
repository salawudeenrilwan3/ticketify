import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  RadioGroup,
} from "@chakra-ui/react";
import { supabase } from "../services/supabaseClient";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Sign up user and store role in user_metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role },
        },
      });
      if (error) throw error;

      if (data.user) {
        // 2️⃣ Insert into profiles table (so RLS works later)
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: "",
          role,
        });

        // 3️⃣ Redirect based on role
        if (role === "organizer") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20}>
      <VStack gap={4} align="stretch">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Role selection */}
        <RadioGroup.Root
          value={role}
          onValueChange={(val) => val.value !== null && setRole(val.value)}
        >
          <HStack gap={6}>
            <RadioGroup.Item value="user">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>User</RadioGroup.ItemText>
            </RadioGroup.Item>
            <RadioGroup.Item value="organizer">
              <RadioGroup.ItemHiddenInput />
              <RadioGroup.ItemIndicator />
              <RadioGroup.ItemText>Organizer</RadioGroup.ItemText>
            </RadioGroup.Item>
          </HStack>
        </RadioGroup.Root>

        {error && <Text color="red.500">{error}</Text>}

        <Button
          colorScheme="brand"
          onClick={handleRegister}
          color="white"
          loading={loading}
        >
          Register
        </Button>
      </VStack>
    </Box>
  );
}
