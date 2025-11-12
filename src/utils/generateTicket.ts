// src/utils/generateTicket.ts
import jsPDF from "jspdf";
import QRCode from "qrcode";

type Ticket = {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
};

export async function generateTicketPDF(ticket: Ticket) {
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(20);
  doc.text("🎟 Ticketify - Event Ticket", 20, 20);

  // Event Info
  doc.setFontSize(14);
  doc.text(`Event: ${ticket.title}`, 20, 40);
  doc.text(`Date: ${new Date(ticket.date).toDateString()}`, 20, 50);
  doc.text(`Location: ${ticket.location}`, 20, 60);
  doc.text(`Price: €${ticket.price}`, 20, 70);
  doc.text(`Ticket ID: ${ticket.id}`, 20, 80);

  // Generate QR Code with ticket ID
  const qrData = await QRCode.toDataURL(ticket.id);
  doc.addImage(qrData, "PNG", 20, 90, 50, 50);

  // Save PDF
  doc.save(`${ticket.title}-ticket.pdf`);
}
