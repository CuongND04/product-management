const md5 = require("md5");
const User = require("../../models/user.model");

const generateHelper = require("../../helpers/generate.js");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  // tìm xem đã có tài khoản đó chưa
  const existUser = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existUser) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  // trường hợp tài khoản chưa tồn tại
  req.body.password = md5(req.body.password);
  // thêm tài khoản mới vào database
  const user = new User(req.body);
  await user.save();
  // tạo cookie token user
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};
