const systemConfig = require("../../config/system.js");
const dashboardRouter = require("./dashboard.route.js");
const productRouter = require("./product.route.js");
const productCategoryRouter = require("./product-category.route.js");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccountRoutes = require("./my-account.route.js");
const settingRoutes = require("./setting.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRouter
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRouter);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRouter
  );

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use(PATH_ADMIN + "/auth", authRoutes);

  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );

  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);
};
