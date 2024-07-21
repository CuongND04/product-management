const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  // SocketIO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        // room_chat_id: String,
        content: content,
        // images: Array,
      });
      await chat.save();
    });
  });
  // END SocketIO

  // Get data from database
  const chats = await Chat.find({
    deleted: false,
  });
  for (chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser;
  }
  // END Get data from database

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
