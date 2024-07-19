const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
// [GET]
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);
  const newProducts = productHelper.priceNewProducts(productsFeatured);

  console.log(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Homepage",
    productsFeatured: newProducts,
  });
};
