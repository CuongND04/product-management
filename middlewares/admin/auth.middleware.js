const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  // Nếu không tồn tại token
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const user = await Account.findOne({
    token: req.cookies.token,
    deleted: false,
    status: "active",
  }).select("-password");
  // Nếu không có tài khoản đấy trong database
  if (!user) {
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const role = await Role.findOne({
    _id: user.role_id,
    deleted: false,
  }).select("title permissions");

  res.locals.user = user;
  res.locals.role = role;
  next();
};
