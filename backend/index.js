const express = require("express");
const cors = require("cors");
////// SOCKET SERVER ////////
const { server, app } = require("./src/socket/socket.js");
require("dotenv").config();
const connectDb = require("./src/db/connect.js");

const path = require("path");

////// MIDDLEWARE ////////
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

////// ROUTES ////////
const userRoutes = require("./src/routes/user.js");
app.use("/auth", userRoutes);
const messageRoutes = require("./src/routes/message.js");
app.use("/message", messageRoutes);
const conversationRoutes = require("./src/routes/conversation.js");
app.use("/conversation", conversationRoutes);

app.use(
  express.static(path.join(__dirname, "../frontend/dist/frontend/browser"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "../",
      "frontend",
      "dist",
      "frontend",
      "browser",
      "index.html"
    )
  );
});

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
