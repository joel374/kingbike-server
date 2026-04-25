const { Carousel } = require("../models");
const fs = require("fs");
const path = require("path");

const carouselController = {
  getCarousels: async (req, res) => {
    try {
      const carousels = await Carousel.findAll({
        where: { is_active: true }
      });
      res.status(200).send({
        message: "Success get carousels",
        data: carousels
      });
    } catch (error) {
      res.status(500).send({
        message: "Error get carousels",
        error: error.message
      });
    }
  },

  adminGetCarousels: async (req, res) => {
    try {
      const carousels = await Carousel.findAll();
      res.status(200).send({
        message: "Success get all carousels",
        data: carousels
      });
    } catch (error) {
      res.status(500).send({
        message: "Error get carousels",
        error: error.message
      });
    }
  },

  addCarousel: async (req, res) => {
    try {
      const { title, text } = req.body;
      let image_url = "";
      
      if (req.file) {
        image_url = req.file.filename;
      }

      const carousel = await Carousel.create({
        title,
        text,
        image_url,
        is_active: true
      });

      res.status(201).send({
        message: "Success add carousel",
        data: carousel
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).send({
        message: "Error add carousel",
        error: error.message
      });
    }
  },

  updateCarousel: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, text, is_active } = req.body;
      
      const carousel = await Carousel.findByPk(id);
      if (!carousel) {
        return res.status(404).send({ message: "Carousel not found" });
      }

      let image_url = carousel.image_url;
      if (req.file) {
        // Delete old image if exists
        if (carousel.image_url) {
          const oldPath = path.join(__dirname, "../public", carousel.image_url);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        image_url = req.file.filename;
      }

      await Carousel.update(
        { title, text, image_url, is_active: is_active === "true" || is_active === true },
        { where: { id } }
      );

      res.status(200).send({
        message: "Success update carousel"
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).send({
        message: "Error update carousel",
        error: error.message
      });
    }
  },

  deleteCarousel: async (req, res) => {
    try {
      const { id } = req.params;
      const carousel = await Carousel.findByPk(id);
      
      if (carousel && carousel.image_url) {
        const oldPath = path.join(__dirname, "../public", carousel.image_url);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await Carousel.destroy({ where: { id } });
      res.status(200).send({
        message: "Success delete carousel"
      });
    } catch (error) {
      res.status(500).send({
        message: "Error delete carousel",
        error: error.message
      });
    }
  }
};

module.exports = carouselController;
