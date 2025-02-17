const { Pic } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { sort = "DESC", startDate, endDate } = req.query;

      const whereCondition = {};

      // Thêm điều kiện lọc theo createdAt nếu có startDate hoặc endDate
      if (startDate || endDate) {
        whereCondition.createdAt = {};
        if (startDate) whereCondition.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereCondition.createdAt[Op.lte] = new Date(endDate);
      }

      const pics = await Pic.findAll({
        where: whereCondition,
        order: [["createdAt", sort.toUpperCase()]],
      });

      res.status(200).send(pics);
    } catch (error) {
      console.error("Get all pictures error:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
  getAllByAuthor: async (req, res) => {
    try {
      const userId = req.user.id; // Lấy ID của user hiện tại
      const { sort = "DESC", startDate, endDate } = req.query;
      const whereCondition = { authorId: userId };

      if (startDate || endDate) {
        whereCondition.createdAt = {};
        if (startDate) whereCondition.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereCondition.createdAt[Op.lte] = new Date(endDate);
      }

      const pics = await Pic.findAll({
        where: whereCondition,
        order: [["createdAt", sort.toUpperCase()]],
      });

      res.status(200).json(pics);
    } catch (error) {
      console.error("Get all pictures by user error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  create: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { originalname } = req.file;
      const ext = path.extname(originalname);

      req.body.ext = ext;
      req.body.authorId = req.user.id;
      const pic = await Pic.create(req.body);

      const savedPath = path.join(
        __dirname,
        "../public/pics",
        pic.id.toString() + ext
      );
      await fs.promises.writeFile(savedPath, req.file.buffer);

      res.status(200).send(pic);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.code });
    }
  },
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const pic = await Pic.findByPk(id);

      if (!pic) {
        return res.status(404).json({ error: "Picture not found" });
      }
      if (pic.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this picture" });
      }

      const picPath = path.join(
        __dirname,
        "../public/pics",
        `${pic.id}${pic.ext}`
      );

      await pic.destroy();

      // Delete the file from storage if it exists
      if (fs.existsSync(picPath)) {
        await fs.promises.unlink(picPath);
      }

      res.status(200).json({ message: "Picture deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Lấy ID user hiện tại
      const pic = await Pic.findByPk(id);

      if (!pic) {
        return res.status(404).json({ error: "Picture not found" });
      }
      if (pic.authorId !== userId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to update this picture" });
      }
      if (!req.body.title) {
        return res.status(400).json({ error: "Title is required" });
      }

      pic.title = req.body.title;
      await pic.save();

      res.status(200).send(pic);
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  },

  upload: upload,
};
