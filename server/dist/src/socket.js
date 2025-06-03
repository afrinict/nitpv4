import { Server } from 'socket.io';
import { storage } from './storage';
// User socket mapping
const userSockets = new Map();
export function setupSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        // Authenticate user
        socket.on('authenticate', async (userId) => {
            try {
                const user = await storage.getUser(userId);
                if (user) {
                    // Associate this socket with the user
                    userSockets.set(userId, socket.id);
                    socket.join(`user:${userId}`);
                    console.log(`User ${userId} authenticated with socket ${socket.id}`);
                    // Send online status
                    io.emit('user:status', { userId, status: 'online' });
                }
            }
            catch (error) {
                console.error('Socket authentication error:', error);
            }
        });
        // Join chat room
        socket.on('room:join', (roomId) => {
            socket.join(`room:${roomId}`);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
        });
        // Leave chat room
        socket.on('room:leave', (roomId) => {
            socket.leave(`room:${roomId}`);
            console.log(`Socket ${socket.id} left room ${roomId}`);
        });
        // Handle chat messages
        socket.on('message:room', async (data) => {
            try {
                // Store message in database
                const message = await storage.createChatMessage({
                    roomId: data.roomId,
                    senderId: data.senderId,
                    message: data.message,
                    attachmentUrl: data.attachmentUrl
                });
                // Broadcast message to room
                io.to(`room:${data.roomId}`).emit('message:room', message);
            }
            catch (error) {
                console.error('Socket room message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        // Handle direct messages
        socket.on('message:direct', async (data) => {
            try {
                // Store message in database
                const message = await storage.createDirectMessage({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    message: data.message,
                    attachmentUrl: data.attachmentUrl
                });
                // Send to receiver if online
                const receiverSocketId = userSockets.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message:direct', message);
                }
                // Send back to sender for confirmation
                socket.emit('message:direct', message);
            }
            catch (error) {
                console.error('Socket direct message error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        // Handle message read status
        socket.on('message:read', async (messageId) => {
            try {
                await storage.markDirectMessageAsRead(messageId);
                socket.emit('message:read:ack', { messageId });
            }
            catch (error) {
                console.error('Socket message read error:', error);
            }
        });
        // Handle typing indicator
        socket.on('typing', (data) => {
            if (data.receiverId) {
                const receiverSocketId = userSockets.get(data.receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('typing', { userId: data.userId });
                }
            }
            else if (data.roomId) {
                socket.to(`room:${data.roomId}`).emit('typing', { userId: data.userId, roomId: data.roomId });
            }
        });
        // Handle vote counting in real-time during elections
        socket.on('election:vote', async (data) => {
            try {
                // Only admins would have permission to broadcast vote updates
                // We'll implement the actual logic in the routes
                io.emit('election:vote:update', {
                    electionId: data.electionId,
                    positionId: data.positionId,
                    candidateId: data.candidateId
                });
            }
            catch (error) {
                console.error('Socket election vote error:', error);
            }
        });
        // Disconnect
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            // Find and remove user from mapping
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    io.emit('user:status', { userId, status: 'offline' });
                    break;
                }
            }
        });
    });
    return io;
}
// Utility functions for sending notifications via Socket.IO
export function sendNotification(io, userId, notification) {
    const socketId = userSockets.get(userId);
    if (socketId) {
        io.to(socketId).emit('notification', notification);
    }
}
export function broadcastNotification(io, notification) {
    io.emit('notification', notification);
}
