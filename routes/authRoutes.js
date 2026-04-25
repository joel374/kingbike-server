const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.patch("/verification", authController.verification);
router.post("/login", authController.login);
router.get("/refresh-token", verifyToken, authController.refreshToken);

module.exports = router;
