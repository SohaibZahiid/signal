const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  markAsRead,
  markAsUnread,
} = require("../controllers/message");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/:receiverId", authMiddleware, sendMessage);
router.get("/:receiverId", authMiddleware, getMessages);
router.post("/:conversationId/read", authMiddleware, markAsRead);
router.post("/:conversationId/unread", authMiddleware, markAsUnread);

module.exports = router;
