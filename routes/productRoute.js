const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { upload } = require("../lib/uploader");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post(
  "/add",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "PRODUCT",
  }).fields([
    { name: "image_url1", maxCount: 1 },
    { name: "image_url2", maxCount: 1 },
    { name: "image_url3", maxCount: 1 },
    { name: "image_url4", maxCount: 1 },
    { name: "image_url5", maxCount: 1 },
  ]),
  productController.add
);
router.patch(
  "/update/:id",
  verifyToken,
  upload({
    acceptedFileTypes: ["jpg", "jpeg", "png"],
    filePrefix: "PRODUCT",
  }).fields([
    { name: "image_url1", maxCount: 1 },
    { name: "image_url2", maxCount: 1 },
    { name: "image_url3", maxCount: 1 },
    { name: "image_url4", maxCount: 1 },
    { name: "image_url5", maxCount: 1 },
  ]),
  productController.update
);
router.delete("/delete/:id", verifyToken, productController.delete);
router.get("/get", productController.get);

router.post(
  "/upload",
  verifyToken,
  upload({
    acceptedFileTypes: ["xlsx", "xls"],
    filePrefix: "EXCEL_PRODUCT",
  }).single("file"),
  productController.uploadExcel
);

router.get("/template", productController.getTemplate);

module.exports = router;
