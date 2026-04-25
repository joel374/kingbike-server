const db = require("../models");

const addressController = {
  addAddress: async (req, res) => {
    try {
      const { id } = req.user;
      const { address_label, city_id, province_id, postal_code, full_address, is_primary } = req.body;

      if (is_primary) {
        await db.Address.update({ is_primary: false }, { where: { UserId: id } });
      }

      const response = await db.Address.create({
        UserId: id,
        address_label,
        city_id,
        province_id,
        postal_code,
        full_address,
        is_primary: is_primary || false,
      });

      return res.status(200).json({
        message: "Address added successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getAddress: async (req, res) => {
    try {
      const { id } = req.user;
      const response = await db.Address.findAll({
        where: { UserId: id },
        order: [["is_primary", "DESC"]],
      });

      return res.status(200).json({
        message: "Get addresses successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  updateAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const { address_label, city_id, province_id, postal_code, full_address, is_primary } = req.body;

      if (is_primary) {
        await db.Address.update({ is_primary: false }, { where: { UserId: req.user.id } });
      }

      await db.Address.update(
        {
          address_label,
          city_id,
          province_id,
          postal_code,
          full_address,
          is_primary,
        },
        { where: { id } }
      );

      return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      await db.Address.destroy({ where: { id } });
      return res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  setPrimary: async (req, res) => {
    try {
      const { id } = req.params;
      const UserId = req.user.id;

      await db.Address.update({ is_primary: false }, { where: { UserId } });
      await db.Address.update({ is_primary: true }, { where: { id } });

      return res.status(200).json({ message: "Set primary address successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = addressController;
