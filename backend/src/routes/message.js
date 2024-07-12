const express = require("express");
const router = express.Router();

const {
  createMessage,
  getConversationMessages,
  getConversationsLastMessages,
} = require("../controllers/message");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createMessage);
router.get("/", authMiddleware, getConversationsLastMessages);
router.get("/:conversationId", getConversationMessages);

module.exports = router;

// const express = require("express");
// const router = express.Router();

// const {
//   createMessage,
//   getConversationsLastMessage,
// } = require("../controllers/message");
// const authMiddleware = require("../middlewares/authMiddleware");

// router.post("/", authMiddleware, createMessage);
// router.get("/", authMiddleware, getConversationsLastMessage);

// module.exports = router;
