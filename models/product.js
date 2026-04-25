"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Image_Url);
      Product.hasMany(models.Favorite);
      Product.hasMany(models.TransactionItem);
      Product.belongsTo(models.Category);
      Product.belongsTo(models.Brand_Category);
    }
  }
  Product.init(
    {
      product_name: DataTypes.STRING,
      SKU: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      weight: {
        type: DataTypes.INTEGER,
        defaultValue: 1000,
      },
      length: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      width: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      height: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
