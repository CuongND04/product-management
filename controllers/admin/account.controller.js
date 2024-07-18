const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const generateHelper = require("../../helpers/generate.js");
var md5 = require("md5");
// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
  // Find
  let find = {
    deleted: false,
  };
  // End Find

  // mảng tài khoản trả về trừ password token
  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });

    record.roleTitle = role.title;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  console.log("roles", roles);
  res.render("admin/pages/accounts/create", {
    pageTitle: "Thêm mới tài khoản",
    roles: roles,
  });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  req.body.password = md5(req.body.password); //mã hóa
  req.body.token = generateHelper.generateRandomString(30);

  const account = new Account(req.body);
  await account.save();

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
