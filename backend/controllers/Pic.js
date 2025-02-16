const { Pic } = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const pics = await Pic.findAll();
      res.status(200).send(pics);
    } catch (error) {
      res.status(500).send(error);
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
      const pic = await Pic.findByPk(req.params.id);

      if (!pic) {
        return res.status(404).json({ error: "Picture not found" });
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
      const pic = await Pic.findByPk(req.params.id);

      if (!pic) {
        return res.status(404).json({ error: "Picture not found" });
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
