const systemConfig = require("../../config/system.js");
const dashboardRouter = require("./dashboard.route.js");
const productRouter = require("./product.route.js");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATH_ADMIN + "/products", productRouter);
};
