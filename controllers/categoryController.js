const { Op } = require("sequelize");
const db = require("../models");

const categoryController = {
  add: async (req, res) => {
    try {
      const { category_name } = req.body;

      const findCategory = await db.Category.findOne({
        where: {
          category_name,
        },
      });

      if (findCategory) {
        return res.status(400).json({
          message: "Category already exists",
        });
      }

      const response = await db.Category.create(req.body);

      return res.status(200).json({
        message: "Category added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server error",
      });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const { category_name } = req.body;

      const findCategory = await db.Category.findOne({ where: { id: id } });

      if (!findCategory) {
        return res.status(400).json({
          message: "Category not found",
        });
      }

      if (findCategory.category_name === category_name) {
        return res.status(400).json({
          message: "Category already exists",
        });
      }

      await db.Category.update(
        {
          category_name,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "Category updated",
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

      const findCategory = await db.Category.findOne({
        where: {
          id: id,
        },
      });

      if (!findCategory) {
        return res.status(400).json({
          message: "Category not found",
        });
      }

      await db.Category.destroy({
        where: { id: id },
      });

      return res.status(200).json({
        message: "Category deleted",
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
        category_name = "",
        _sortBy = "category_name",
        _sortDir = "ASC",
        _limit = 10,
        _page = 1,
      } = req.query;

      if (category_name) {
        const response = await db.Category.findAndCountAll({
          limit: Number(_limit),
          order: [[_sortBy, _sortDir]],
          offset: (_page - 1) * _limit,
          where: {
            category_name: {
              [Op.like]: `%${category_name}%`,
            },
          },
        });

        return res.status(200).json({
          message: "Get Category By Category Name",
          data: response.rows,
          dataCount: response.count,
        });
      }

      const response = await db.Category.findAndCountAll({
        limit: Number(_limit),
        order: [[_sortBy, _sortDir]],
        offset: (_page - 1) * _limit,
      });

      return res.status(200).json({
        message: "Get Category",
        data: response.rows,
        dataCount: response.count,
      });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const response = await db.Category.findOne({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "Get Category By Id",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  addBrand: async (req, res) => {
    try {
      const { brand_name } = req.body;

      const findBrand = await db.Brand_Category.findOne({
        where: { brand_name: brand_name },
      });

      if (findBrand) {
        return res.status(400).json({
          message: "Brand already exists",
        });
      }

      await db.Brand_Category.create({ brand_name });

      return res.status(200).json({
        message: "Brand added",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  updateBrand: async (req, res) => {
    try {
      const { id } = req.params;
      const { brand_name } = req.body;

      const findBrand = await db.Brand_Category.findOne({ where: { id: id } });

      if (!findBrand) {
        return res.status(400).json({
          message: "Brand not found",
        });
      }

      if (findBrand.brand_name === brand_name) {
        return res.status(400).json({
          message: "Category already exists",
        });
      }

      await db.Brand_Category.update(
        {
          brand_name,
        },
        {
          where: {
            id: id,
          },
        }
      );

      return res.status(200).json({
        message: "Brand updated",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  deleteBrand: async (req, res) => {
    try {
      const { id } = req.params;

      const findBrand = await db.Brand_Category.findOne({ where: { id } });

      if (!findBrand) {
        return res.status(400).json({
          message: "Brand not found",
        });
      }

      await db.Brand_Category.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "Brand deleted",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  getBrand: async (req, res) => {
    try {
      const {
        brand_name = "",
        _sortBy = "brand_name",
        _sortDir = "ASC",
        _limit = 10,
        _page = 1,
      } = req.query;

      if (brand_name) {
        const response = await db.Brand_Category.findAndCountAll({
          limit: Number(_limit),
          order: [[_sortBy, _sortDir]],
          offset: (_page - 1) * _limit,
          where: {
            brand_name: {
              [Op.like]: `%${brand_name}%`,
            },
          },
        });

        return res.status(200).json({
          message: "Get Brand Category By Brand Name",
          data: response.rows,
          dataCount: response.count,
        });
      }

      const response = await db.Brand_Category.findAndCountAll({
        limit: Number(_limit),
        order: [[_sortBy, _sortDir]],
        offset: (_page - 1) * _limit,
      });

      return res.status(200).json({
        message: "Get Brand Category",
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
  uploadCategoryExcel: async (req, res) => {
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
          if (!row.category_name) {
            failCount++;
            continue;
          }

          const existing = await db.Category.findOne({ where: { category_name: row.category_name } });
          if (existing) {
            failCount++;
            continue;
          }

          await db.Category.create({
            category_name: row.category_name,
          });

          successCount++;
        } catch (e) {
          console.error(e);
          failCount++;
        }
      }

      const fs = require("fs");
      fs.unlinkSync(req.file.path); 

      return res.status(200).json({
        message: `Berhasil mengupload ${successCount} kategori. Gagal: ${failCount}.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  uploadBrandExcel: async (req, res) => {
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
          if (!row.brand_name) {
            failCount++;
            continue;
          }

          const existing = await db.Brand_Category.findOne({ where: { brand_name: row.brand_name } });
          if (existing) {
            failCount++;
            continue;
          }

          await db.Brand_Category.create({
            brand_name: row.brand_name,
          });

          successCount++;
        } catch (e) {
          console.error(e);
          failCount++;
        }
      }

      const fs = require("fs");
      fs.unlinkSync(req.file.path); 

      return res.status(200).json({
        message: `Berhasil mengupload ${successCount} merek. Gagal: ${failCount}.`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getCategoryTemplate: async (req, res) => {
    try {
      const xlsx = require("xlsx");
      const wb = xlsx.utils.book_new();
      
      const wsData = [
        ["category_name"],
        ["Mountain Bike"] // Example
      ];
      
      const ws = xlsx.utils.aoa_to_sheet(wsData);
      xlsx.utils.book_append_sheet(wb, ws, "Categories");
      
      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
      res.setHeader("Content-Disposition", 'attachment; filename="Category_Template.xlsx"');
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.send(buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getBrandTemplate: async (req, res) => {
    try {
      const xlsx = require("xlsx");
      const wb = xlsx.utils.book_new();
      
      const wsData = [
        ["brand_name"],
        ["Polygon"] // Example
      ];
      
      const ws = xlsx.utils.aoa_to_sheet(wsData);
      xlsx.utils.book_append_sheet(wb, ws, "Brands");
      
      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
      res.setHeader("Content-Disposition", 'attachment; filename="Brand_Template.xlsx"');
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.send(buffer);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = categoryController;
