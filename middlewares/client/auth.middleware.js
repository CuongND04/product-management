const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  // nếu chưa có token thì bắt nó đăng nhập
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
    status: "active",
  });

  if (!user) {
    res.clearCookie("tokenUser");
    res.redirect(`/user/login`);
    return;
  }

  next();
};
