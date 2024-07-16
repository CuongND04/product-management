let count = 0;
function createTree(arr, parentId = "") {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count++;
      const newItem = item;
      newItem.index = count;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
}

module.exports.tree = (records) => {
  count = 0;
  const tree = createTree(records);
  return tree;
};
