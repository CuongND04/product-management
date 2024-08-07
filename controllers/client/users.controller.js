const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);
  // END Socket

  const userId = res.locals.user.id;
  const requestFriends = res.locals.user.requestFriends;
  const acceptFriends = res.locals.user.acceptFriends;
  // từ danh sách bạn bè tạo ra một mảng id của bạn bè
  const friendsList = res.locals.user.friendsList.map((user) => user.user_id);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, // not equal
      { _id: { $nin: requestFriends } }, // not in
      { _id: { $nin: acceptFriends } }, // not in
      { _id: { $nin: friendsList } }, // not in
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  try {
    // SocketIO
    usersSocket(res);
    // End SocketIO

    // tìm danh sách lời mời đã gửi của tài khoản đang đăng nhập
    const requestFriends = res.locals.user.requestFriends;

    // tìm tất cả thằng bạn trong danh sách lời mời đã gửi
    const users = await User.find({
      _id: { $in: requestFriends },
      status: "active",
      deleted: false,
    }).select("id avatar fullName");

    res.render("client/pages/users/request", {
      pageTitle: "Lời mời đã gửi",
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  try {
    // SocketIO
    usersSocket(res);
    // End SocketIO

    const acceptFriends = res.locals.user.acceptFriends;

    const users = await User.find({
      _id: { $in: acceptFriends },
      status: "active",
      deleted: false,
    }).select("avatar fullName");

    res.render("client/pages/users/accept", {
      pageTitle: "Lời mời đã nhận",
      users: users,
    });
  } catch (error) {
    console.log(error);
  }
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendsList = res.locals.user.friendsList.map((user) => user.user_id);

  const users = await User.find({
    _id: { $in: friendsList },
    status: "active",
    deleted: false,
  }).select("avatar fullName statusOnline");

  users.forEach((user) => {
    // tìm trong danh sách bạn bè của  thằng đang đăng nhập thằng "user" trong vòng lặp
    const info = res.locals.user.friendsList.find(
      (userFriend) => userFriend.user_id == user.id
    );
    user.roomChatId = info.room_chat_id;
  });
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
