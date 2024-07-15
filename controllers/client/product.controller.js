const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: "false",
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = Math.floor(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    return item;
  });
  console.log(newProducts);
  res.render("client/pages/products/index", {
    pageTitle: "ProductList",
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
