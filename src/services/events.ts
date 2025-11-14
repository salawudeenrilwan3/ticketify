import { supabase } from "./supabaseClient";
import type { EventRow } from "../types";

export async function getEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getEventById(id: string): Promise<EventRow | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function createEvent(input: Omit<EventRow, "id" | "created_at" | "created_by">, userId: string) {
  const payload = { ...input, created_by: userId };
  const { data, error } = await supabase.from("events").insert(payload).select().single();
  if (error) throw error;
  return data as EventRow;
}
