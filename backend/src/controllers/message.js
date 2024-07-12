const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const createMessage = async (req, res) => {
  const { conversationId, senderId, receiverId, message } = req.body;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      const newConversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      const newMessage = await Message.create({
        conversationId: newConversation._id,
        senderId,
        receiverId,
        message,
      });
      return res.status(200).json(newMessage);
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      message,
    });
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getConversationsLastMessages = async (req, res) => {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      members: userId,
    }).select("_id");
    const conversationIds = conversations.map(
      (conversation) => conversation._id
    );
    if (!conversationIds)
      return res.status(500).json("No conversations found for this user");

    // const messages = await Message.find({ $in: conversationIds });
    // if (!messages) return res.status(500).json("No messages found");
    const lastMessages = await Message.aggregate([
      { $match: { conversationId: { $in: conversationIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
    ]);
    if (!lastMessages)
      return res.status(500).json("No messages found for tese conversations");

    res.status(200).json(lastMessages);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createMessage,
  getConversationMessages,
  getConversationsLastMessages,
};
