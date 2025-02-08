import { io } from "socket.io-client";

// Connect to the WebSocket server
const socket = io("http://localhost:5000"); // Replace with backend URL

// When connected to the WebSocket server
socket.on("connect", () => {
    console.log("✅ Connected to WebSocket Server!");
    console.log("🔗 Connected With ID:", socket.id);
});

// Listen for real-time event updates
socket.on("eventCreated", (data) => {
    console.log("🆕 Event Created:", data);
});

socket.on("eventUpdated", (updatedEvent) => {
    console.log("✏️ Event Updated:", updatedEvent);
});

socket.on("eventDeleted", (deletedEventId) => {
    console.log("❌ Event Deleted, ID:", deletedEventId);
});

// Listen for user updates
socket.on("updateUsers", (data) => {
    console.log("📩 Received broadcast event:", data);
});

// Handle disconnection
socket.on("disconnect", () => {
    console.log("🔴 Disconnected from WebSocket Server!");
});

export default socket;
