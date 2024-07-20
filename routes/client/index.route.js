const categoryMiddleware = require("../../middlewares/client/category.middleware");
const homeRouter = require("./home.route");
const productRouter = require("./product.route");
const searchRoutes = require("./search.route");

module.exports = (app) => {
  app.use(categoryMiddleware.category); // cái nào ở dưới cũng chạy qua cái này
  app.use("/", homeRouter);
  app.use("/products", productRouter);
  app.use("/search", searchRoutes);
};
