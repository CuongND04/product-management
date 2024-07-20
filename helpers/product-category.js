const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parent_id) => {
  const getCategory = async (parent_id) => {
    let allSubs = [];

    const listSub = await ProductCategory.find({
      parent_id: parent_id,
      deleted: false,
      status: "active",
    }).select("id title");

    allSubs = [...listSub];

    for (const sub of listSub) {
      const childs = await getCategory(sub.id); // đệ quy
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };
  const result = await getCategory(parent_id);
  return result;
};
