const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Please add a conversation"],
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a sender"],
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please add a receiver"],
    },
    message: {
      type: String,
      required: [true, "Please add a message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", MessageSchema);
