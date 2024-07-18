const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadsCloud.middleware.js");

const validate = require("../../validates/admin/account.validate.js");
const controller = require("../../controllers/admin/account.controller.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

module.exports = router;
