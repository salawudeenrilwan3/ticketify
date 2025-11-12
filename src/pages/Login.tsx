import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import { supabase } from "../services/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("No user returned");

      // 1️⃣ Check if profile exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // 2️⃣ If not, insert profile using user_metadata.role
      let finalRole = "user";
      if (!profile) {
        finalRole = user.user_metadata.role || "user";
        await supabase.from("profiles").insert({
          id: user.id,
          full_name: "",
          role: finalRole,
        });
      } else {
        finalRole = profile.role;
      }

      // 3️⃣ Redirect based on role
      if (finalRole === "organizer") {
        navigate("/dashboard"); // ✅ match App.tsx route
      } else {
        navigate("/"); // ✅ attendees go home
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
        {error && <Text color="red.500">{error}</Text>}
        <Button
          colorScheme="brand"
          color="white"
          onClick={handleLogin}
          loading={loading}
        >
          Login
        </Button>
      </VStack>
    </Box>
  );
}
