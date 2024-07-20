const homeRouter = require("./home.route");
const productRouter = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
  app.use(categoryMiddleware.category); // cái nào ở dưới cũng chạy qua cái này
  app.use(cartMiddleware.cart); // cái nào ở dưới cũng chạy qua cái này
  app.use("/", homeRouter);
  app.use("/products", productRouter);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
};
