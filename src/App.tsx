import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyTickets from "./pages/MyTickets";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import { RequireAuth, RequireOrganizer } from "./routes/guards";
import EditEvent from "./pages/EditEvent";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/organizer/edit-event/:id" element={<EditEvent />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Attendee-only */}
        <Route
          path="/my-tickets"
          element={
            <RequireAuth>
              <MyTickets />
            </RequireAuth>
          }
        />

        {/* Organizer-only */}
        <Route
          path="/dashboard"
          element={
            <RequireOrganizer>
              <OrganizerDashboard />
            </RequireOrganizer>
          }
        />
        <Route
          path="/my-events"
          element={
            <RequireOrganizer>
              <MyEvents />
            </RequireOrganizer>
          }
        />
        <Route
          path="/create-event"
          element={
            <RequireOrganizer>
              <CreateEvent />
            </RequireOrganizer>
          }
        />
      </Routes>
    </Layout>
  );
}
