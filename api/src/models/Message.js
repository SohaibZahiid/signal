const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a senderId"],
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a receiverId"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
