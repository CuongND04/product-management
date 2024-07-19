const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
// [GET]
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);
  const newProductsFeatured = productHelper.priceNewProducts(productsFeatured);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);
  const newProductsNew = productHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Homepage",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
