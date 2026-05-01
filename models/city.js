"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate(models) {
      City.belongsTo(models.Province, { foreignKey: 'province_id' });
    }
  }
  City.init(
    {
      city_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      province_id: DataTypes.STRING,
      city_name: DataTypes.STRING,
      type: DataTypes.STRING,
      postal_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "City",
      timestamps: false,
    }
  );
  return City;
};
