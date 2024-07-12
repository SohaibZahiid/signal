const express = require("express");
const {
  createConversation,
  getUserConversations,
} = require("../controllers/conversation");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createConversation);
router.get("/:userId", authMiddleware, getUserConversations);

module.exports = router;
