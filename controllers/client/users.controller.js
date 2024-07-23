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
  console.log(`requestFriends = ${requestFriends}`);
  console.log(`acceptFriends = ${acceptFriends}`);
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
