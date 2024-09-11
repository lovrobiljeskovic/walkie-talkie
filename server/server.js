const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ message: "Server is running" });
});

const clients = new Map();

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join", (username) => {
    clients.set(socket.id, { id: socket.id, username });
    console.log(`User ${username} joined with socket ID: ${socket.id}`);
    io.emit("userJoined", { id: socket.id, username });
  });

  socket.on("message", (message) => {
    const user = clients.get(socket.id);
    if (user) {
      console.log(`Received message from ${user.username}: ${message.text}`);
      io.emit("message", { ...message, user });
    }
  });

  socket.on("voice", (audioData) => {
    const user = clients.get(socket.id);
    if (user) {
      console.log(`Received voice data from ${user.username}, size: ${audioData.length} bytes`);
      const arrayBuffer = audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength);
      socket.broadcast.emit("voice", { audioData: arrayBuffer, user });
    }
  });

  socket.on("disconnect", () => {
    const user = clients.get(socket.id);
    if (user) {
      console.log(`User ${user.username} disconnected: ${socket.id}`);
      clients.delete(socket.id);
      io.emit("userLeft", user);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
