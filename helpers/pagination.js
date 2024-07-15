module.exports = (objectPagination, query, countProducts) => {
  // nếu có tham số page ở trên route
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page); // chuyển sang số
  }
  // tìm vị trí sản phẩm bắt đầu trong trang đấy
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  // truy vấn trong db nên cần dùng await
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  return objectPagination;
};
