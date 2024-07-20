const express = require("express");
const router = express.Router();
const validate = require("../../validates/client/user.validate.js");
const controller = require("../../controllers/client/user.controller.js");

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);
module.exports = router;
