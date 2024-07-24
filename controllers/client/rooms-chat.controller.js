const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  res.render("client/pages/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
  });
};
// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendsList = res.locals.user.friendsList; // lấy listfriend của thằng đang đăng nhập

  // lấy ra thông tin của những thằng trong listFriend
  for (const friend of friendsList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
    }).select("fullName avatar");
    friend.infoFriend = infoFriend;
  }

  res.render("client/pages/rooms-chat/create", {
    pageTitle: "Tạo phòng",
    friendsList: friendsList,
  });
};

// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;
  // khởi tạo dữ liệu phòng chat
  const dataRoomChat = {
    title: title,
    typeRoom: "group",
    users: [],
  };
  // nhập dữ liệu người tham gia
  usersId.forEach((userId) => {
    dataRoomChat.users.push({
      user_id: userId,
      role: "user",
    });
  });
  // nhập dữ liệu thằng tạo ra phòng
  dataRoomChat.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });
  console.log(`dataRoomChat = ${dataRoomChat}`);
  const roomChat = new RoomChat(dataRoomChat);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};
