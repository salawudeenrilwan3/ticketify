// src/components/ProtectedRoute.tsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  requireOrganizer?: boolean;
};

export default function ProtectedRoute({ children, requireOrganizer }: Props) {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Wait for auth check

  if (!user) return <Navigate to="/login" replace />;
  if (requireOrganizer && role !== "organizer")
    return <Navigate to="/" replace />;

  return <>{children}</>;
}
