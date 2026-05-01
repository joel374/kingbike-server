"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    static associate(models) {
      Province.hasMany(models.City, { foreignKey: 'province_id' });
    }
  }
  Province.init(
    {
      province_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      province: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Province",
      timestamps: false,
    }
  );
  return Province;
};
