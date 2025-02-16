const express = require("express");
const router = express.Router();
const Pic = require("../controllers/Pic");

router.get("/", Pic.getAll);
router.post("/", Pic.upload.single("pic"), Pic.create);
router.delete("/:id", Pic.delete);
router.put("/:id", Pic.update);

module.exports = router;
