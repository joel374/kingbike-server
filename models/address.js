"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User);
      Address.hasMany(models.Transaction);
    }
  }
  Address.init(
    {
      UserId: DataTypes.INTEGER,
      address_label: DataTypes.STRING,
      city_id: DataTypes.STRING,
      city_name: DataTypes.STRING,
      province_id: DataTypes.STRING,
      province_name: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      full_address: DataTypes.TEXT,
      is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Address",
    }
  );
  return Address;
};
