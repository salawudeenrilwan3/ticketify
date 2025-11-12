export type EventRow = {
  id: string;
  title: string;
  description: string;
  date: string;         // ISO date
  location: string;
  price: number;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
};
