const Cart = require("../../models/card.model");

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
