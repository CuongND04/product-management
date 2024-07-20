const Cart = require("../../models/card.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

// [GET] /cart/
module.exports.index = async (req, res) => {
  const cart = await Cart.findOne({
    _id: req.cookies.cartId,
  });

  cart.totalPrice = 0; // thêm thuộc tính tổng giá trị
  // cart.products là một mảng chứa các sản phẩm, mỗi item là một sản phẩm
  for (const item of cart.products) {
    const infoProduct = await Product.findOne({
      _id: item.product_id,
    }).select("thumbnail title price discountPercentage stock slug");

    infoProduct.priceNew = productHelper.priceNewProduct(infoProduct).priceNew;

    infoProduct.totalPrice = infoProduct.priceNew * item.quantity;

    cart.totalPrice += infoProduct.totalPrice;

    item.infoProduct = infoProduct;
  }

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};
// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  try {
    const cart = await Cart.findOne({
      _id: cartId,
    });
    // kiểm tra xem sản phẩm đó tồn tại trong Giỏ hàng chưa
    const existProductInCart = cart.products.find(
      (item) => item.product_id == productId
    );

    if (existProductInCart) {
      const quantityUpdate = existProductInCart.quantity + quantity;

      await Cart.updateOne(
        {
          _id: cartId,
          "products.product_id": productId, // nested object
        },
        {
          $set: { "products.$.quantity": quantityUpdate }, // $: tham chiếu tới phần tử đầu tiên trong product thỏa mãn điều kiện
        }
      );
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity,
      };

      await Cart.updateOne(
        {
          _id: cartId,
        },
        {
          $push: { products: objectCart },
        }
      );
    }
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng.");
  } catch (error) {
    req.flash("error", "Thêm sản phẩm vào giỏ hàng không thành công!");
  }

  res.redirect("back");
};

// [GET] /cart/delete/:productId
module.exports.deleteItem = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");

  res.redirect("back");
};
