const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/add", verifyToken, addressController.addAddress);
router.get("/get", verifyToken, addressController.getAddress);
router.patch("/update/:id", verifyToken, addressController.updateAddress);
router.delete("/delete/:id", verifyToken, addressController.deleteAddress);
router.patch("/set-primary/:id", verifyToken, addressController.setPrimary);

module.exports = router;
