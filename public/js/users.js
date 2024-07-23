// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add"); // nó lấy thằng cha gần nhất
      // thêm class add để nó hiện button hủy
      const userId = button.getAttribute("btn-add-friend"); // lấy id của thằng muốn kết bạn

      socket.emit("CLIENT_ADD_FRIREND", userId);
    });
  });
}
console.log("OK");
// Hết Chức năng gửi yêu cầu
