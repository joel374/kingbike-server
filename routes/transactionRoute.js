const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/checkout", verifyToken, transactionController.checkout);
router.get("/user", verifyToken, transactionController.getTransactions);
router.get("/admin/all", verifyToken, transactionController.getAllTransactions);
router.get("/tracking/:id", verifyToken, transactionController.getTracking);
router.post("/notification", transactionController.notification);

module.exports = router;
