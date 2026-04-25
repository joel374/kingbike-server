const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post("/add/:ProductId", favoriteController.add);
router.delete("/delete/:ProductId", favoriteController.delete);
router.get("/get", favoriteController.get);

module.exports = router;
