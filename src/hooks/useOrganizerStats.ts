// src/hooks/useOrganizerStats.ts
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

type EventStats = {
  id: string;
  title: string;
  ticketsSold: number;
  revenue: number;
};

export default function useOrganizerStats() {
  const { user } = useAuth();
  const [totalEvents, setTotalEvents] = useState(0);
  const [ticketsSold, setTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [perEvent, setPerEvent] = useState<EventStats[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      console.log("🔍 Current logged in user:", user);

      // 1️⃣ Fetch all events created by this organizer
      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, title, organizer_id")
        .eq("organizer_id", user.id);

      if (eventsError) {
        console.error("❌ Error fetching events:", eventsError.message);
        return;
      }

      console.log("📌 Events fetched for this organizer:", events);

      setTotalEvents(events.length);

      // 2️⃣ Fetch all tickets for these events
      const eventIds = events.map((e) => e.id);
      if (eventIds.length === 0) {
        console.log("⚠️ No events found for this organizer");
        setTicketsSold(0);
        setTotalRevenue(0);
        setPerEvent([]);
        return;
      }

      const { data: tickets, error: ticketsError } = await supabase
        .from("tickets")
        .select("id, event_id, quantity, total_price, user_id, purchased_at")
        .in("event_id", eventIds);

      if (ticketsError) {
        console.error("❌ Error fetching tickets:", ticketsError.message);
        return;
      }

      console.log("🎟 Tickets fetched for these events:", tickets);

      // 3️⃣ Aggregate stats
      let totalTickets = 0;
      let revenue = 0;
      const perEventStats: EventStats[] = events.map((event) => {
        const eventTickets =
          tickets?.filter((t) => t.event_id === event.id) || [];

        const sold = eventTickets.reduce((sum, t) => sum + (t.quantity || 0), 0);
        const rev = eventTickets.reduce(
          (sum, t) => sum + Number(t.total_price || 0),
          0
        );

        totalTickets += sold;
        revenue += rev;

        console.log(
          `📊 Event ${event.title}: ticketsSold=${sold}, revenue=${rev}`
        );

        return {
          id: event.id,
          title: event.title,
          ticketsSold: sold,
          revenue: rev,
        };
      });

      setTicketsSold(totalTickets);
      setTotalRevenue(revenue);
      setPerEvent(perEventStats);

      console.log("✅ Aggregated totals:", {
        totalTickets,
        revenue,
        perEventStats,
      });
    };

    fetchStats();
  }, [user]);

  return { totalEvents, ticketsSold, totalRevenue, perEvent };
}
