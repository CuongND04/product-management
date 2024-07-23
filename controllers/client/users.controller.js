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
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, // not equal
      { _id: { $nin: requestFriends } }, // not in
      { _id: { $nin: acceptFriends } }, // not in
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