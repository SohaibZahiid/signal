const express = require("express");
const cors = require("cors");
// const app = express();
////// SOCKET SERVER ////////
const { server, app } = require("./socket/socket.js");
require("dotenv").config();
const connectDb = require("./db/connect");

////// MIDDLEWARE ////////
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.json());

////// ROUTES ////////
const userRoutes = require("./routes/user");
app.use("/auth", userRoutes);
const messageRoutes = require("./routes/message");
app.use("/message", messageRoutes);
const conversationRoutes = require("./routes/conversation");
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
