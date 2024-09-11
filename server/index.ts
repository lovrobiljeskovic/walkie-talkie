import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

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

app.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

interface User {
  id: string;
  username: string;
}

interface Message {
  text: string;
  user: User;
}

const clients = new Map<string, User>();

io.on("connection", (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("join", (username: string) => {
    clients.set(socket.id, { id: socket.id, username });
    console.log(`User ${username} joined with socket ID: ${socket.id}`);
    io.emit("userJoined", { id: socket.id, username });
  });

  socket.on("message", (message: { text: string }) => {
    const user = clients.get(socket.id);
    if (user) {
      console.log(`Received message from ${user.username}: ${message.text}`);
      io.emit("message", { ...message, user });
    }
  });

  socket.on("voice", (audioData: ArrayBuffer) => {
    const user = clients.get(socket.id);
    if (user) {
      console.log(`Received voice data from ${user.username}, size: ${audioData.byteLength} bytes`);
      socket.broadcast.emit("voice", { audioData, user });
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