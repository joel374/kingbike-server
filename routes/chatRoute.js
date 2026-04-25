const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/post", chatController.postChat);
router.post("/postToUser/:id", chatController.postChatUser);
router.get("/get", chatController.fetchChat);
router.get("/getAdmin", chatController.fetchChatAdmin);

module.exports = router;
