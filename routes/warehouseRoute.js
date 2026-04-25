const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouseController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/get", warehouseController.getWarehouse);
router.patch("/update", verifyToken, warehouseController.updateWarehouse);

module.exports = router;
