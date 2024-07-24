const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccecss = async (req, res, next) => {
  try {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    // từ phòng chat tìm lại "user đang đăng nhập" xem có không
    const userInRoomChat = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id": userId,
      deleted: false,
    });
    // nếu thằng đang đăng nhập không có trong id của phòng
    if (!userInRoomChat) {
      res.redirect("/");
      return;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
