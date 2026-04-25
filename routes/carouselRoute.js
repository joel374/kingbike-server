const express = require("express");
const router = express.Router();
const carouselController = require("../controllers/carouselController");
const { verifyToken, checkAdmin } = require("../middlewares/authMiddleware");
const { upload } = require("../lib/uploader");

// Public
router.get("/", carouselController.getCarousels);

// Admin only
router.get("/admin", verifyToken, checkAdmin, carouselController.adminGetCarousels);
router.post(
  "/", 
  verifyToken, 
  checkAdmin, 
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "CAROUSEL",
  }).single("image"),
  carouselController.addCarousel
);
router.patch(
  "/:id", 
  verifyToken, 
  checkAdmin, 
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "CAROUSEL",
  }).single("image"),
  carouselController.updateCarousel
);
router.delete("/:id", verifyToken, checkAdmin, carouselController.deleteCarousel);

module.exports = router;
