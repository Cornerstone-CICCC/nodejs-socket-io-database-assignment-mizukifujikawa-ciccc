import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';
import chatController from '../controllers/chat.controller';

const setupChatSocket = (io: Server) => {
  io.on('connection', async (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { username, message, room } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();

        // io.emit('newMessage', {
        //   username: 'System',
        //   message: `${data.username} joined the room`,
        //   room: data.room
        // })

        // Broadcast the chat object to all connected clients via the newMessage event
        // io.emit('newMessage', chat);

        // For room-based broadcast
        io.to(data.room).emit('newMessage', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });
  
    socket.on('join room', (data) => {
      socket.join(data.room)
      console.log(`${data.username} has joined the ${data.room}`)
      io.to(data.room).emit('newMessage', {
        username: 'System',
        message: `${data.username} joined the room`,
        room: data.room
      })
    })
  
    socket.on('leave room', (data) => {
      socket.leave(data.room)
      console.log(`${data.username} left ${data.room}`)
      io.to(data.room).emit('newMessage', {
        username: 'System',
        message: `${data.username} has left chat.`,
        room: data.room
      })
    })

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;