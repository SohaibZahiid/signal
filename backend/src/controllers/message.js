const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getReceiverSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const { message } = req.body;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    // UPDATE CONVERSATION LAST MESSAGE TO NEWLY SEND MESSAGE
    conversation.lastMessage = newMessage._id;

    await Promise.all([conversation.save(), newMessage.save()]);

    conversation = await Conversation.findById(conversation._id).populate(
      "members lastMessage"
    );

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("get-message", {
        message: newMessage,
        conversation,
      });
    }
    res.status(200).json({ message: newMessage, conversation });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
