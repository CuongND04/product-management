const systemConfig = require("../../config/system.js");
const dashboardRouter = require("./dashboard.route.js");
const productRouter = require("./product.route.js");
const productCategoryRouter = require("./product-category.route.js");
const roleRoutes = require("./role.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
  app.use(PATH_ADMIN + "/products-category", productCategoryRouter);
  app.use(PATH_ADMIN + "/roles", roleRoutes);
};
