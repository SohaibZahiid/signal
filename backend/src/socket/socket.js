const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId != "undefiend") userSocketMap[userId] = socket.id;
  //ONLINE USERS
  io.emit("online-users", Object.keys(userSocketMap));

  // export const getReceiverSocketId = (receiverId) => {
  //   return userSocketMap[receiverId];
  // };

  //SEND MESSAGE
  socket.on("send-message", (message) => {
    io.to(userSocketMap[message.receiverId]).emit("get-message", message);
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("online-users", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server };
