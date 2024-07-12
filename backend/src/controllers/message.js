const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

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

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);
    res.status(200).json(newMessage);
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

    if (!conversation) return res.status(500).json("conversation not found");

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
