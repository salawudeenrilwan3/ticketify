// src/context/TicketContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface Ticket {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
}

interface TicketContextType {
  tickets: Ticket[];
  purchaseTicket: (ticket: Ticket) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const purchaseTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  return (
    <TicketContext.Provider value={{ tickets, purchaseTicket }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context)
    throw new Error("useTickets must be used within TicketProvider");
  return context;
}
