const { Op } = require('sequelize');
const db = require('../models');
const chatController = {
  postChat: async (req, res) => {
    try {
      const { message } = req.body;

      const findChat = await db.Chat.findOne({
        where: {
          UserId: req.user.id,
        },
      });

      if (!findChat) {
        const chat = await db.Chat.create({
          UserId: req.user.id,
          from: req.user.id,
          to: 'admin',
        });

        await db.Message.create({
          message: message,
          ChatId: chat.id,
        });

        return res.status(200).json({
          message: 'Message Sent',
        });
      }

      await db.Message.create({
        message: message,
        ChatId: findChat.id,
        UserId: req.user.id,
      });

      return res.status(200).json({
        message: 'Message Sent',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server Error',
      });
    }
  },
  postChatUser: async (req, res) => {
    try {
      const { message } = req.body;
      const { id } = req.params;

      const findChat = await db.Chat.findOne({
        where: {
          from: id,
          to: 'admin',
        },
      });

      await db.Message.create({
        message: message,
        ChatId: findChat.id,
        // UserId: 'admin',
      });

      return res.status(200).json({
        message: 'Message Sent',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server Error',
      });
    }
  },
  fetchChat: async (req, res) => {
    try {
      const response = await db.Chat.findOne({
        where: {
          from: req.user.id,
        },
        include: [{ model: db.Message }],
      });

      return res.status(200).json({
        message: 'Fetch Chat',
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server Error',
      });
    }
  },
  fetchChatAdmin: async (req, res) => {
    try {
      const response = await db.Chat.findAll({
        where: {
          to: 'admin',
        },
        include: [{ model: db.User }, { model: db.Message }],
      });

      return res.status(200).json({
        message: 'Fetch Chat',
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Server Error',
      });
    }
  },
};

module.exports = chatController;
