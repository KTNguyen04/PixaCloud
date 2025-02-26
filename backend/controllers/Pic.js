const { Pic, Author } = require("../models");
const multer = require("multer");
const path = require("path");

const { Op } = require("sequelize");
const config = require("../config/config");

const AWS = require("aws-sdk");
// const s3 = new AWS.S3({
//   accessKeyId: config.S3.accessKey,
//   secretAccessKey: config.S3.secretKey,
//   region: config.S3.region,
// });
const s3 = new AWS.S3({
  region: config.S3.region,
});

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { sort = "DESC", startDate, endDate } = req.query;

      const whereCondition = {};

      if (startDate || endDate) {
        whereCondition.createdAt = {};
        if (startDate) whereCondition.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereCondition.createdAt[Op.lte] = new Date(endDate);
      }

      const pics = await Pic.findAll({
        where: whereCondition,
        order: [["createdAt", sort.toUpperCase()]],
        include: [
          {
            model: Author,
            attributes: ["id", "name"],
          },
        ],
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
        include: [
          {
            model: Author,
            attributes: ["id", "name"],
          },
        ],
      });

      res.status(200).json(pics);
    } catch (error) {
      console.error("Get all pictures by user error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  create: async (req, res, next) => {
    try {
      const { originalname, contentType } = req.body;
      if (!originalname || !contentType) {
        return res.status(400).json({ error: "Missing file details" });
      }

      // const { originalname } = req.file;
      const ext = path.extname(originalname);

      req.body.ext = ext;
      req.body.authorId = req.user.id;
      const pic = await Pic.create(req.body);
      const savedName = "pics/" + pic.id + ext;

      const presignedUrl = s3.getSignedUrl("putObject", {
        Bucket: config.S3.bucketName,
        Key: savedName,
        Expires: 60,
        ContentType: req.body.contentType,
      });
      res.status(200).json({ pic, presignedUrl });
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

      const deleteParams = {
        Bucket: config.S3.bucketName,
        Key: "pics/" + pic.id + pic.ext,
      };

      await s3.deleteObject(deleteParams).promise();
      await pic.destroy();

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
};
