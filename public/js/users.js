// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add"); // nó lấy thằng cha gần nhất
      // thêm class add để nó hiện button hủy
      const userIdB = button.getAttribute("btn-add-friend"); // lấy id của thằng muốn kết bạn

      socket.emit("CLIENT_ADD_FRIEND", userIdB);
    });
  });
}
console.log("OK");
// Hết Chức năng gửi yêu cầu

// Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");

      const userIdB = button.getAttribute("btn-cancel-friend");

      socket.emit("CLIENT_CANCEL_FRIEND", userIdB);
    });
  });
}
// Hết Chức năng hủy gửi yêu cầu
