const express = require("express");
const cors = require("cors");
////// SOCKET SERVER ////////
const { server, app } = require("./src/socket/socket.js");
require("dotenv").config();
const connectDb = require("./src/db/connect.js");

////// MIDDLEWARE ////////
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.json());

////// ROUTES ////////
const userRoutes = require("./src/routes/user.js");
app.use("/auth", userRoutes);
const messageRoutes = require("./src/routes/message.js");
app.use("/message", messageRoutes);
const conversationRoutes = require("./src/routes/conversation.js");
app.use("/conversation", conversationRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
