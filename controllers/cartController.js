const db = require("../models");
const cartController = {
  addProductToCart: async (req, res) => {
    try {
      const { ProductId } = req.params;
      const { quantity } = req.body;

      const findProduct = await db.Product.findOne({
        where: {
          id: ProductId,
        },
      });

      if (!findProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (quantity > findProduct.stock) {
        return res.status(400).json({
          message: "Quantity is out of range",
        });
      }

      const findProductInCart = await db.Cart.findOne({
        where: {
          ProductId,
        },
      });

      if (findProductInCart) {
        return res.status(400).json({
          message: "Product already in cart",
        });
      }

      const response = await db.Cart.create({
        ProductId,
        UserId: req.user.id,
        quantity,
        is_checked: false,
      });

      return res.status(200).json({
        message: "Product successfully added to cart",
        data: findProduct,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
  deleteProductFromCart: async (req, res) => {
    try {
      const { id } = req.params;

      const findCartById = await db.Cart.findOne({
        where: {
          id,
        },
      });

      if (!findCartById) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }

      await db.Cart.destroy({
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "Product successfully deleted from cart",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  getProductInCart: async (req, res) => {
    try {
      const response = await db.Cart.findAll({
        where: {
          UserId: req.user.id,
        },
        include: [{ model: db.Product, include: [{ model: db.Image_Url }] }],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Successfully get all cart items",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  checkedCart: async (req, res) => {
    try {
      const { id } = req.params;

      const findProductInCart = await db.Cart.findOne({
        where: {
          id,
        },
      });

      if (!findProductInCart) {
        return res.status(400).json({
          message: "Cart not found",
        });
      }

      await db.Cart.update(
        {
          is_checked: findProductInCart.is_checked === true ? false : true,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "Cheked items successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  checkedAllCart: async (req, res) => {
    try {
      const findAllItems = await db.Cart.findAll();
      const findAllItemsChecked = await db.Cart.findAll({
        where: {
          is_checked: 1,
        },
      });

      if (findAllItemsChecked.length === findAllItems.length) {
        await db.Cart.update(
          {
            is_checked: 0,
          },
          {
            where: {
              is_checked: 1,
            },
          }
        );

        return res.status(200).json({
          message: "Unchecked items successfully",
        });
      }

      await db.Cart.update(
        {
          is_checked: 1,
        },
        {
          where: {
            is_checked: 0,
          },
        }
      );

      return res.status(200).json({
        message: "Checked all items successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  totalPrice: async (req, res) => {
    try {
      const findProduct = await db.Cart.findAll({
        where: {
          is_checked: 1,
        },
        include: [{ model: db.Product }],
      });

      const countTotalPrice = findProduct.map(
        (val) => val.Product.price * val.quantity
      );
      let totalPrice = 0;
      const totalQuantity = findProduct.length;

      for (let i = 0; i < countTotalPrice.length; i++) {
        totalPrice += countTotalPrice[i];
      }

      return res.status(200).json({
        message: "Get total price",
        data: { totalPrice, totalQuantity },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
  quantityProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const findProductInCart = await db.Cart.findOne({
        where: {
          id,
        },
      });

      if (!findProductInCart) {
        return res.status(400).json({
          message: "Cart not found",
        });
      }

      await db.Cart.update(
        {
          quantity,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({
        message: "Quantity updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  },
};

module.exports = cartController;
