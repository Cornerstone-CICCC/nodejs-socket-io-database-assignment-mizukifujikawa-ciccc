"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../models/chat.model");
const setupChatSocket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // Listen to 'sendMessage' event
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, message, room } = data;
            try {
                // Save message to MongoDB
                const chat = new chat_model_1.Chat({ username, message, room });
                yield chat.save();
                // io.emit('newMessage', {
                //   username: 'System',
                //   message: `${data.username} joined the room`,
                //   room: data.room
                // })
                // Broadcast the chat object to all connected clients via the newMessage event
                // io.emit('newMessage', chat);
                // For room-based broadcast
                io.to(data.room).emit('newMessage', chat);
            }
            catch (error) {
                console.error('Error saving chat:', error);
            }
        }));
        socket.on('join room', (data) => {
            socket.join(data.room);
            console.log(`${data.username} has joined the ${data.room}`);
            io.to(data.room).emit('newMessage', {
                username: 'System',
                message: `${data.username} joined the room`,
                room: data.room
            });
        });
        socket.on('leave room', (data) => {
            socket.leave(data.room);
            console.log(`${data.username} left ${data.room}`);
            io.to(data.room).emit('newMessage', {
                username: 'System',
                message: `${data.username} has left chat.`,
                room: data.room
            });
        });
        // On disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    }));
};
exports.default = setupChatSocket;
