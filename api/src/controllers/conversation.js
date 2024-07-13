const Conversation = require("../models/Conversation");

const getUserConversations = async (req, res) => {
  const loggedInUserId = req.user._id;
  try {
    const conversations = await Conversation.find({
      members: loggedInUserId,
    })
      .populate("members")
      .sort({ createdAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { getUserConversations };