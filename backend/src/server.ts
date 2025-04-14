import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieSession from 'cookie-session'
import cors from 'cors';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.routes';
import userRouter from './routes/user.routes';
import chatSocket from './sockets/chat.socket';
import dotenv from 'dotenv';
dotenv.config();

// Create server
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:4321", // Astro port
  credentials: true // allow cookie transfer
}))
app.use(express.json());
const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
  throw new Error("Missing cookie keys!")
}

app.use(cookieSession({
  name: 'session',
  keys: [SIGN_KEY, ENCRYPT_KEY],
  maxAge: 60 * 60 * 1000
}))

// Routes
app.use('/users', userRouter);
app.use('/api/chat', chatRouter);

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4321', // Your frontend url here (Astro, React, vanilla HTML)
    methods: ["GET", "POST"]
  },
});

// Connect to MongoDB and start server
const MONGO_URI = process.env.DATABASE_URL!
mongoose
  .connect(MONGO_URI, { dbName: 'chatroom' })
  .then(() => {
    console.log('Connected to MongoDB database');

    // Start Socket.IO
    chatSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });