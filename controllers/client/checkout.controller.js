const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const Order = require("../../models/order.model");
// [GET] /checkout/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({
    _id: req.cookies.cartId,
  });

  cart.totalPrice = 0;

  for (const item of cart.products) {
    const infoProduct = await Product.findOne({
      _id: item.product_id,
    }).select("thumbnail title price discountPercentage stock slug");

    infoProduct.priceNew = productHelper.priceNewProduct(infoProduct).priceNew;

    infoProduct.totalPrice = infoProduct.priceNew * item.quantity;

    cart.totalPrice += infoProduct.totalPrice;

    item.infoProduct = infoProduct;
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const products = [];

  for (const item of cart.products) {
    // Lấy thông tin từng sản phẩm có trong giỏ hàng
    const product = await Product.findOne({
      _id: item.product_id,
    });
    // lấy thông tin ra chuẩn schema
    const objectProduct = {
      product_id: item.product_id,
      price: product.price,
      discountPercentage: product.discountPercentage,
      quantity: item.quantity,
    };

    products.push(objectProduct);
  }

  const dataOrder = {
    // user_id: String,
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(dataOrder);
  await order.save();

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const id = req.params.id;
    // lấy ra đơn hàng
    const order = await Order.findOne({
      _id: id,
    });

    order.totalPrice = 0;
    // lấy từng sản phẩm trong đơn hàng ra để xử lí
    for (const product of order.products) {
      // thằng sản phẩm lấy từ database
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail");
      // lấy chuẩn dữ liệu schema của order
      product.title = productInfo.title;
      product.thumbnail = productInfo.thumbnail;

      product.priceNew = productHelper.priceNewProduct(product).priceNew;

      product.totalPrice = product.priceNew * product.quantity;
      order.totalPrice += product.totalPrice;
    }
    res.render("client/pages/checkout/success", {
      pageTitle: "Đặt hàng thành công",
      order: order,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};
