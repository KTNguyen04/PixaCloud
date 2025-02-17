const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/VerifyToken");
const Pic = require("../controllers/Pic");

router.get("/", Pic.getAll);
router.get("/personal", verifyToken, Pic.getAllByAuthor);
router.post("/", verifyToken, Pic.upload.single("pic"), Pic.create);
router.delete("/:id", verifyToken, Pic.delete);
router.put("/:id", verifyToken, Pic.update);

module.exports = router;
