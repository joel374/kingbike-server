const { Op } = require("sequelize");
const db = require("../models");

const productController = {
  add: async (req, res) => {
    try {
      const {
        product_name,
        stock,
        CategoryId,
        BrandCategoryId,
        price,
        description,
        is_active,
      } = req.body;

      const findProduct = await db.Product.findOne({
        where: {
          product_name,
        },
      });

      if (findProduct) {
        return res.status(400).json({
          message: "Product already exists ",
        });
      }

      const response = await db.Product.create(req.body);

      const image_url = req.files;

      for (const property in image_url) {
        await db.Image_Url.create({
          image_url: image_url[property][0].filename,
          ProductId: response.id,
        });
      }

      return res.status(200).json({
        message: "Product added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const {
        product_name,
        stock,
        CategoryId,
        BrandCategoryId,
        price,
        description,
        prev_image
      } = req.body;

      const findProduct = await db.Product.findOne({
        where: {
          id,
        },
      });

      if (!findProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const response = await db.Product.update(req.body, {
        where: {
          id,
        },
      });

      const image_url = req.files;
      if (prev_image) console.log(prev_image.length);
      
      if (!image_url || Object.keys(image_url).length === 0) {
        // If no new images uploaded, we might just keep the old ones.
        // Or if it's strictly required, return error:
        // return res.status(400).json({ message: "Please choose image" });
      } else {
        await db.Image_Url.destroy({
          where: {
            ProductId: id,
          },
        });

        for (const property in image_url) {
          await db.Image_Url.create({
            image_url: image_url[property][0].filename,
            ProductId: id,
          });
        }
      }

      return res.status(200).json({
        message: "Product updated",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await db.Product.findOne({
        where: {
          id,
        },
      });

      if (!findProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      await db.Image_Url.destroy({
        where: {
          ProductId: id,
        },
      });

      await db.Product.destroy({
        where: { id },
      });

      return res.status(200).json({
        message: "Product deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  get: async (req, res) => {
    try {
      const {
        id = "",
        SKU = "",
        product_name = "",
        CategoryId = "",
        BrandCategoryId = "",
        is_active,
        _sortBy = "product_name",
        _sortDir = "ASC",
        _limit = 6,
        _page = 1,
      } = req.query;

      if (id) {
        const response = await db.Product.findOne({
          include: [
            { model: db.Category },
            { model: db.Brand_Category },
            { model: db.Image_Url },
          ],
          where: {
            id: id,
          },
        });

        return res.status(200).json({
          message: "Get Product By Id",
          data: response,
        });
      }

      let whereCondition = {};
      if (product_name) {
        whereCondition.product_name = {
          [Op.like]: `%${product_name}%`,
        };
      }
      if (CategoryId) whereCondition.CategoryId = CategoryId;
      if (BrandCategoryId) whereCondition.BrandCategoryId = BrandCategoryId;
      if (is_active !== undefined) whereCondition.is_active = is_active === "true" || is_active === true;

      const response = await db.Product.findAndCountAll({
        limit: Number(_limit),
        order: [[_sortBy, _sortDir]],
        offset: (_page - 1) * _limit,
        include: [
          { model: db.Category },
          { model: db.Brand_Category },
          { model: db.Image_Url },
        ],
        where: whereCondition,
      });

      return res.status(200).json({
        message: "Get Products Success",
        data: response.rows,
        dataCount: response.count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  uploadExcel: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const xlsx = require("xlsx");
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      let successCount = 0;
      let failCount = 0;

      for (const row of data) {
        try {
          if (!row.product_name) {
            failCount++;
            continue;
          }

          const existing = await db.Product.findOne({ where: { product_name: row.product_name } });
          if (existing) {
            failCount++;
            continue;
          }

          const newProduct = await db.Product.create({
            product_name: row.product_name,
            stock: row.stock || 0,
            CategoryId: row.CategoryId || 1,
            BrandCategoryId: row.BrandCategoryId || 1,
            price: row.price || 0,
            description: row.description || "",
            SKU: row.SKU || "",
            weight: row.weight || 1000,
            length: row.length || 10,
            width: row.width || 10,
            height: row.height || 10,
            is_active: row.is_active !== undefined ? row.is_active : true
          });

          await db.Image_Url.create({
            image_url: "default.png",
            ProductId: newProduct.id,
          });

          successCount++;
        } catch (e) {
          console.error(e);
          failCount++;
        }
      }

      const fs = require("fs");
      fs.unlinkSync(req.file.path); // remove file after processing

      return res.status(200).json({
        message: `Berhasil mengupload ${successCount} produk. Gagal: ${failCount}.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getTemplate: async (req, res) => {
    try {
      const xlsx = require("xlsx");
      const wb = xlsx.utils.book_new();

      // 1. Product Upload Sheet
      const wsProductData = [
        ["product_name", "stock", "CategoryId", "BrandCategoryId", "price", "description", "SKU", "weight", "length", "width", "height", "is_active"],
        ["Contoh Sepeda BMX", 10, 1, 1, 1500000, "Sepeda BMX keren", "BMX-001", 1000, 10, 10, 10, true]
      ];
      const wsProduct = xlsx.utils.aoa_to_sheet(wsProductData);
      xlsx.utils.book_append_sheet(wb, wsProduct, "Products");

      // 2. Category Reference Sheet
      const categories = await db.Category.findAll();
      const wsCategoryData = [["CategoryId", "Category Name"]];
      categories.forEach(c => wsCategoryData.push([c.id, c.category_name]));
      const wsCategory = xlsx.utils.aoa_to_sheet(wsCategoryData);
      xlsx.utils.book_append_sheet(wb, wsCategory, "Reference_Categories");

      // 3. Brand Reference Sheet
      const brands = await db.Brand_Category.findAll();
      const wsBrandData = [["BrandCategoryId", "Brand Name"]];
      brands.forEach(b => wsBrandData.push([b.id, b.brand_name]));
      const wsBrand = xlsx.utils.aoa_to_sheet(wsBrandData);
      xlsx.utils.book_append_sheet(wb, wsBrand, "Reference_Brands");

      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
      res.setHeader("Content-Disposition", 'attachment; filename="Product_Template.xlsx"');
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.send(buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = productController;
