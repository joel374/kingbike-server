const db = require("../models");
const midtransClient = require("midtrans-client");

// Initialize Midtrans Snap client
let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "YOUR_MIDTRANS_SERVER_KEY",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "YOUR_MIDTRANS_CLIENT_KEY",
});

const transactionController = {
  checkout: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.user;
      const { AddressId, shipping_method, shipping_cost, items } = req.body;

      // 1. Calculate total price
      let total_price = 0;
      for (let item of items) {
        const product = await db.Product.findByPk(item.ProductId);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${product ? product.product_name : item.ProductId} is out of stock or not found`);
        }
        total_price += product.price * item.quantity;
      }

      const final_price = total_price + (shipping_cost || 0);
      const invoice_number = `INV-${Date.now()}-${id}`;

      // 2. Create Transaction
      const transaction = await db.Transaction.create(
        {
          invoice_number,
          UserId: id,
          AddressId: shipping_method === "PICKUP" ? null : AddressId,
          shipping_method,
          shipping_cost: shipping_cost || 0,
          total_price: final_price,
          status: "PENDING",
        },
        { transaction: t }
      );

      // 3. Create Transaction Items & Update Stock
      for (let item of items) {
        const product = await db.Product.findByPk(item.ProductId);
        await db.TransactionItem.create(
          {
            TransactionId: transaction.id,
            ProductId: item.ProductId,
            quantity: item.quantity,
            price: product.price,
          },
          { transaction: t }
        );

        // Update Stock
        await db.Product.update(
          { stock: product.stock - item.quantity },
          { where: { id: item.ProductId }, transaction: t }
        );
      }

      // 4. Create Payment Response (Handle Mock or Midtrans)
      // let midtransResponse = { token: "MOCK_TOKEN", redirect_url: "#" };
      
      // try {
      //   if (process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_SERVER_KEY !== "YOUR_MIDTRANS_SERVER_KEY") {
      //     let parameter = {
      //       transaction_details: {
      //         order_id: invoice_number,
      //         gross_amount: final_price,
      //       },
      //       credit_card: { secure: true },
      //       customer_details: {
      //         first_name: req.user.username,
      //         email: req.user.email,
      //       },
      //     };
      //     midtransResponse = await snap.createTransaction(parameter);
      //   }
      // } catch (err) {
      //   console.log("Midtrans error, falling back to mock:", err.message);
      // }

      await transaction.update(
        {
          // midtrans_token: midtransResponse.token,
          // payment_url: midtransResponse.redirect_url,
          // status: midtransResponse.token === "MOCK_TOKEN" ? "PAID" : "PENDING",
          tracking_number: `KB-${Date.now()}`,
          courier_name: "JNE",
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(200).json({
        message: "Checkout successful",
        data: {
          // token: midtransResponse.token,
          // redirect_url: midtransResponse.redirect_url,
          invoice_number,
        },
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({ message: error.message || "Server Error" });
    }
  },
  getTransactions: async (req, res) => {
    try {
      const { id } = req.user;
      const response = await db.Transaction.findAll({
        where: { UserId: id },
        include: [
          {
            model: db.TransactionItem,
            include: [{ model: db.Product, include: [db.Image_Url] }],
          },
          { model: db.Address },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        message: "Get transactions successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  // Handle Midtrans notification (webhook)
  notification: async (req, res) => {
    try {
      const statusResponse = await snap.transaction.notification(req.body);
      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your database to 'challenge'
        } else if (fraudStatus == "accept") {
          await db.Transaction.update({ status: "PAID" }, { where: { invoice_number: orderId } });
        }
      } else if (transactionStatus == "settlement") {
        await db.Transaction.update({ status: "PAID" }, { where: { invoice_number: orderId } });
      } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
        await db.Transaction.update({ status: "CANCELLED" }, { where: { invoice_number: orderId } });
      } else if (transactionStatus == "pending") {
        await db.Transaction.update({ status: "WAITING_PAYMENT" }, { where: { invoice_number: orderId } });
      }

      return res.status(200).json({ message: "Notification handled" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getTracking: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await db.Transaction.findByPk(id);
      
      if (!transaction) return res.status(404).json({ message: "Transaction not found" });

      // Mock tracking data based on transaction time
      const stages = [
        { status: "Pesanan Dibuat", time: transaction.createdAt, desc: "Pesanan berhasil dibuat dan menunggu pembayaran." },
        { status: "Pembayaran Terverifikasi", time: new Date(transaction.createdAt.getTime() + 1000 * 60 * 30), desc: "Pembayaran telah kami terima." },
        { status: "Diproses", time: new Date(transaction.createdAt.getTime() + 1000 * 60 * 120), desc: "Pesanan sedang dipersiapkan oleh penjual." },
        { status: "Dalam Pengiriman", time: new Date(transaction.createdAt.getTime() + 1000 * 60 * 60 * 5), desc: "Pesanan telah diserahkan ke kurir JNE." },
        { status: "Sampai di Tujuan", time: null, desc: "Kurir sedang dalam perjalanan ke lokasi Anda." }
      ];

      return res.status(200).json({
        message: "Get tracking info successfully",
        data: {
          tracking_number: transaction.tracking_number,
          courier: transaction.courier_name,
          stages: stages.filter(s => s.time !== null || s.status === "Sampai di Tujuan")
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};

module.exports = transactionController;
