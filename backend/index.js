const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middlewares
app.use(express.json());
app.use(cors());

// Attach io to the app so it can be accessed in routes
app.set("io", io);

// 🔵 Socket.io connection
io.on("connection", (socket) => {
  console.log(`🔵 User connected: ${socket.id}`);

  // Notify all users when a new user connects
  io.sockets.emit("updateUsers", { message: `User ${socket.id} connected!` });

  // Event: Handle event creation
  socket.on("eventCreated", (newEvent) => {
    console.log("🆕 Event Created:", newEvent);
    io.sockets.emit("eventCreated", newEvent); // Broadcast to all clients
  });

  // Event: Handle event updates
  socket.on("eventUpdated", (updatedEvent) => {
    console.log("✏️ Event Updated:", updatedEvent);
    io.sockets.emit("eventUpdated", updatedEvent); // Broadcast to all clients
  });

  // Event: Handle event deletion
  socket.on("eventDeleted", (deletedEventId) => {
    console.log("❌ Event Deleted, ID:", deletedEventId);
    io.sockets.emit("eventDeleted", deletedEventId); // Broadcast to all clients
  });

  // Example test event for debugging
  socket.on("testEvent", (data) => {
    console.log(`📡 Received testEvent from ${socket.id}:`, data);
    io.sockets.emit("testEventResponse", {
      message: `Broadcasted: ${data.message}`,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    io.sockets.emit("updateUsers", {
      message: `User ${socket.id} disconnected!`,
    });
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
