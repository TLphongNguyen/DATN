import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
import socketontroller from "./src/Controller/socketController";
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://datn-beryl.vercel.app"],
    methods: ["GET", "POST"],
  },
});

export default { io };
const PORT = process.env.PORT || 8000;
socketontroller(io);
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
