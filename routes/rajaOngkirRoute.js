const express = require("express");
const router = express.Router();
const rajaOngkirController = require("../controllers/rajaOngkirController");

router.get("/provinces", rajaOngkirController.getProvinces);
router.get("/cities", rajaOngkirController.getCities);
router.post("/cost", rajaOngkirController.getCost);

module.exports = router;
