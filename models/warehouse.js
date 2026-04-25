"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Warehouse extends Model {
    static associate(models) {
      // no associations needed for now
    }
  }
  Warehouse.init(
    {
      warehouse_name: DataTypes.STRING,
      address: DataTypes.TEXT,
      city_id: DataTypes.STRING,
      city_name: DataTypes.STRING,
      province_id: DataTypes.STRING,
      province_name: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Warehouse",
    }
  );
  return Warehouse;
};
