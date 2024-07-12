const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const conversationExists = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (conversationExists) {
      return res.status(409).json("Conversation already with selected user.");
    }

    const conversation = await Conversation.create({
      members: [senderId, receiverId],
    });

    await conversation.populate("members", "-password");

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createConversation,
  getUserConversations,
};
