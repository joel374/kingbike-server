"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand_Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Brand_Category.hasMany(models.Product);
    }
  }
  Brand_Category.init(
    {
      brand_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Brand_Category",
    }
  );
  return Brand_Category;
};
