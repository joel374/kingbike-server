const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken } = require("../middlewares/authMiddleware");

const { upload } = require("../lib/uploader");

router.post("/add", verifyToken, categoryController.add);
router.patch("/update/:id", verifyToken, categoryController.update);
router.delete("/delete/:id", verifyToken, categoryController.delete);
router.get("/get", categoryController.get);
router.get("/getById/:id", categoryController.getById);

router.post(
  "/upload",
  verifyToken,
  upload({
    acceptedFileTypes: ["xlsx", "xls"],
    filePrefix: "EXCEL_CAT",
  }).single("file"),
  categoryController.uploadCategoryExcel
);

router.post("/addBrand", verifyToken, categoryController.addBrand);
router.patch("/updateBrand/:id", verifyToken, categoryController.updateBrand);
router.delete("/deleteBrand/:id", verifyToken, categoryController.deleteBrand);
router.get("/getBrand", categoryController.getBrand);

router.post(
  "/uploadBrand",
  verifyToken,
  upload({
    acceptedFileTypes: ["xlsx", "xls"],
    filePrefix: "EXCEL_BRAND",
  }).single("file"),
  categoryController.uploadBrandExcel
);

router.get("/template", categoryController.getCategoryTemplate);
router.get("/templateBrand", categoryController.getBrandTemplate);

module.exports = router;
