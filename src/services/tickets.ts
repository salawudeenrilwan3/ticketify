import { supabase } from "../services/supabaseClient";

// Purchase a ticket
export async function purchaseTicket(eventId: string, userId: string, quantity: number) {
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("price, organizer_id")
    .eq("id", eventId)
    .single();

  if (eventError || !eventData) throw new Error("Event not found");

  const totalPrice = quantity * eventData.price;

  const { error } = await supabase.from("tickets").insert({
    event_id: eventId,
    user_id: userId,
    organizer_id: eventData.organizer_id, // ✅ link ticket to organizer
    quantity,
    total_price: totalPrice,
    purchased_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// Fetch tickets for a user
export async function getMyTickets(userId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      id,
      purchased_at,
      quantity,
      total_price,
      event:events!tickets_event_id_fkey (
        id, title, date, location, price, image_url
      )
    `)
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });

  if (error) throw error;

  return (
    data?.map((t) => ({
      ...t,
      event: Array.isArray(t.event) ? t.event[0] : t.event,
    })) ?? []
  );
}

// Type export (optional)
export type TicketWithEvent = {
  id: string;
  purchased_at: string;
  quantity: number;
  total_price?: number;
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    price: number;
    image_url: string | null;
  } | null;
};
