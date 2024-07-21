const express = require("express");
const multer = require("multer");
const router = express.Router();

const controller = require("../../controllers/admin/setting.controller.js");

const uploadCloud = require("../../middlewares/admin/uploadsCloud.middleware.js");

const upload = multer();

router.get("/general", controller.general);

router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.generalPatch
);

module.exports = router;
