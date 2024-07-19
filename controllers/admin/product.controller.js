const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

var md5 = require("md5");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  // tạo cái mảng để duyệt mà tạo ra các nút bộ lọc
  const filterStatus = filterStatusHelper(req.query);
  // truy vấn
  let find = {
    deleted: false,
  };
  // thêm params status
  if (req.query.status) find.status = req.query.status;
  // thêm params keywork
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find); // đếm số phần tử trong object find

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4, // số item trong một trang
    },
    req.query,
    countProducts
  );

  // End Pagination

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // END Sort

  // lọc ra những sản phẩm thỏa mãn
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  for (const product of products) {
    // lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // lấy ra thông tin người cập nhật gần nhất
    const updatedBy = product.updatedBy.slice(-1)[0]; // lấy ra phần tử cuối cùng
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }

  // xuất ra template của routes
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  await Product.updateOne(
    {
      _id: req.params.id,
    },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );

  req.flash("success", "Cập nhật trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi

module.exports.changeMulti = async (req, res) => {
  console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);

      break;
    default:
      break;
  }
  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Đã xóa thành công sản phẩm!`);

  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.tree(category);

  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory,
  });
};
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  }
  if (req.file) {
    req.thumbnail = `/uploads/${req.file.filename}`;
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };

  const record = new Product(req.body);
  await record.save();

  req.flash("success", "Thêm mới sản phẩm thành công!");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    });
    const category = await ProductCategory.find({
      deleted: false,
    });

    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
  } catch (error) {}

  req.flash("success", "Cập nhật sản phẩm thành công!");
  res.redirect(`back`);
};

// [GET] /admin/products/detail/id
module.exports.detail = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deleted: false,
    });

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
