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

// Chức năng từ chối kết bạn

const deleteUser = (button) => {
  // tạo hàm để tái sử dụng ở dưới
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userIdB = button.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_REFUSE_FRIEND", userIdB);
  });
};
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    deleteUser(button);
  });
}
// Hết Chức năng từ chối kết bạn

// Chức năng chấp nhận kết bạn
const acceptUser = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userIdB = button.getAttribute("btn-accept-friend");

    socket.emit("CLIENT_ACCEPT_FRIEND", userIdB);
  });
};
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptUser(button);
  });
}
// Hết Chức năng chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  // cái data.userId để trả về cho đúng ông B thôi
  const badgeUsersAccept = document.querySelector(
    `[badge-users-accept="${data.userId}"]`
  );
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // trang lời mời kết bạn
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userIdB}"]`
  );
  if (dataUsersAccept) {
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.infoUserA._id); // đặt id phân biệt
    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.infoUserA.fullName}" />
        </div>
        <div class="inner-info">
            <div class="inner-name">
              ${data.infoUserA.fullName}
            </div>
            <div class="inner-buttons">
                <button 
                  class="btn btn-sm btn-primary mr-1"
                  btn-accept-friend="${data.infoUserA._id}"
                >
                  Chấp nhận
                </button>
                <button 
                  class="btn btn-sm btn-secondary mr-1"
                  btn-refuse-friend="${data.infoUserA._id}"
                >
                  Xóa
                </button>
                <button 
                  class="btn btn-sm btn-secondary mr-1" 
                  btn-deleted-friend="" 
                  disabled=""
                >
                  Đã xóa
                </button>
                <button 
                  class="btn btn-sm btn-primary mr-1" 
                  btn-accepted-friend="" 
                  disabled=""
                >
                  Đã chấp nhận
                </button>
            </div>
        </div>
      </div>
    `;
    dataUsersAccept.appendChild(newBoxUser);

    // Bắt sự kiện cho nút Xóa
    const btnRefuseFriend = newBoxUser.querySelector(`[btn-refuse-friend]`);
    deleteUser(btnRefuseFriend);
    // Bắt sự kiện cho nút Chấp nhận
    const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
    acceptUser(btnAcceptFriend);
  }
  // Hết trang lời mời kết bạn

  // Trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector(
    `[data-users-not-friend="${data.userIdB}"]`
  );
  if (dataUsersNotFriend) {
    // tìm box thằng A trong chỗ người không phải bạn, A là thằng gửi lời mời ấy
    const boxUserA = dataUsersNotFriend.querySelector(
      `[user-id="${data.infoUserA._id}"]`
    );
    if (boxUserA) {
      dataUsersNotFriend.removeChild(boxUserA);
    }
  }
  // END Trang danh sách người dùng
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
// giả định là A gửi lời mời kết bạn, rồi A hủy
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  // đây là khung chứa những thằng gửi lời mời kết bạn đến B
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userIdB}"]`
  );
  if (dataUsersAccept) {
    // tìm đến chỗ thằng A gửi lời mời kết bạn
    const boxUserA = dataUsersAccept.querySelector(
      `[user-id="${data.userIdA}"]`
    );
    if (boxUserA) {
      dataUsersAccept.removeChild(boxUserA);
    }
  }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_STATUS_ONLINE
socket.on("SERVER_RETURN_STATUS_ONLINE", (data) => {
  // lấy ra thằng cha chứa tất cả box friend
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    // tìm thằng box có id như được gửi lên
    const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
    if (boxUser) {
      const boxInnerStatus = boxUser.querySelector(".inner-status");
      boxInnerStatus.setAttribute("status", data.statusOnline);
    }
  }
});
// End SERVER_RETURN_STATUS_ONLINE
