const mongoose = require("mongoose");

const ConversationSchema = mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Please add members"],
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversations", ConversationSchema);
