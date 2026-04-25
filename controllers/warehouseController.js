const db = require("../models");

const warehouseController = {
  getWarehouse: async (req, res) => {
    try {
      const response = await db.Warehouse.findOne();
      return res.status(200).json({
        message: "Get warehouse successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  updateWarehouse: async (req, res) => {
    try {
      if (!req.user.is_admin) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { warehouse_name, address, city_id, province_id, postal_code, phone } = req.body;

      let warehouse = await db.Warehouse.findOne();
      if (!warehouse) {
        warehouse = await db.Warehouse.create({
          warehouse_name,
          address,
          city_id,
          province_id,
          postal_code,
          phone,
        });
      } else {
        await warehouse.update({
          warehouse_name,
          address,
          city_id,
          province_id,
          postal_code,
          phone,
        });
      }

      return res.status(200).json({ message: "Warehouse updated successfully", data: warehouse });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = warehouseController;
