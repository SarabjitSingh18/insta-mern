import { Server } from "socket.io"
import express from "express"
import http from "http"

const app = express()
const  server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin:"http://localhost:5173",
        methods: ['Get', 'Post']
    }
})
//this map stores the socket id corresponding to the user id
const userSocketMap = {};
//creating the getReceiverSocketId for the real time message sending
export const getReceiverSocketId = (receiverId )=>userSocketMap[receiverId]

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected : UserId = ${userId} ,socketId = ${socket.id}`)
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))
    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

    })

})


export {server,app,io}