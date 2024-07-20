const express = require("express");
const router = express.Router();
const validate = require("../../validates/client/user.validate.js");
const controller = require("../../controllers/client/user.controller.js");

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", controller.forgotPasswordPost);
module.exports = router;
