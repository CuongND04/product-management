const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category");
const ProductCategory = require("../../models/product-category.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: "false",
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts, // trả về danh sách sản phẩm
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    if (product) {
      res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product,
      });
    }
  } catch (error) {
    res.redirect("/products");
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  // console.log(`slugCategory = ${slugCategory}`);

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active",
  });

  const listSubCategory = await productCategoryHelper.getSubCategory(
    category.id
  );
  const listIdSubCategory = listSubCategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listIdSubCategory] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);
  // console.log(`newProducts = ${newProducts}`);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
