const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const sendEmailHelper = require("../../helpers/sendMail.js");
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

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // tìm tài khoản có email như đăng nhập gửi lên
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  // đăng nhập thành công
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    {
      _id: user.id,
    },
    {
      statusOnline: "online",
    }
  );

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: user.id,
      statusOnline: "online",
    });
  });

  // lưu user_id vào cart
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      statusOnline: "offline",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: res.locals.user.id,
      statusOnline: "offline",
    });
  });
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  // Việc 1: Tạo mã OTP và lưu vào trong database
  const otp = generateHelper.generateRandomNumber(6);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3 * 60 * 1000,
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Việc 2: Gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
  Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP`;
  sendEmailHelper.sendEmail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const tokenUser = req.cookies.tokenUser; // token được tạo từ bước nhập mã otp xong
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  const infoUser = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
  }).select("-password");
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
    infoUser: infoUser,
  });
};
