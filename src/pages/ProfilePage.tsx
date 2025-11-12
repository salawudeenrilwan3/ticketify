import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  Avatar,
  Heading,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { toaster } from "@/components/ui/toaster"; // ✅ Chakra v3 toaster
import { FormControl, FormLabel } from "@chakra-ui/form-control";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  bio: string | null;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url, bio")
      .eq("id", user?.id)
      .single();

    if (error) {
      toaster.create({
        description: `Error loading profile: ${error.message}`,
        type: "error",
        closable: true,
      });
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  async function updateProfile() {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (error) {
      toaster.create({
        description: `Error updating profile: ${error.message}`,
        type: "error",
        closable: true,
      });
    } else {
      toaster.create({
        description: "Profile updated successfully 🎉",
        type: "success",
        duration: 3000,
      });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box mt={10} textAlign="center">
        No profile found.
      </Box>
    );
  }

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
    >
      <Heading size="lg" mb={6} color="black">
        My Profile
      </Heading>

      <VStack gap={4} align="stretch">
        <Avatar.Root>
          <Avatar.Image
            src={profile.avatar_url || undefined}
            alt="Avatar"
            boxSize="100px"
          />
          <Avatar.Fallback boxSize="100px" />
        </Avatar.Root>
        <Input
          type="text"
          placeholder="Avatar URL"
          value={profile.avatar_url || ""}
          onChange={(e) =>
            setProfile({ ...profile, avatar_url: e.target.value })
          }
        />

        <FormControl>
          <FormLabel color="black">Full Name</FormLabel>
          <Input
            color="black"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({ ...profile, full_name: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel color="black">Bio</FormLabel>
          <Textarea
            color="black"
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </FormControl>

        <FormControl>
          <FormLabel color="black">Role</FormLabel>
          <Input value={profile.role} readOnly color="black" />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={updateProfile}
          loading={saving}
          color="white"
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  );
}
