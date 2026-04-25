"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User);
      Transaction.belongsTo(models.Address);
      Transaction.hasMany(models.TransactionItem);
    }
  }
  Transaction.init(
    {
      invoice_number: {
        type: DataTypes.STRING,
        unique: true,
      },
      UserId: DataTypes.INTEGER,
      AddressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      shipping_method: DataTypes.ENUM("DELIVERY", "PICKUP"),
      shipping_cost: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      status: DataTypes.ENUM("PENDING", "WAITING_PAYMENT", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"),
      midtrans_token: DataTypes.STRING,
      payment_url: DataTypes.STRING,
      tracking_number: DataTypes.STRING,
      courier_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
