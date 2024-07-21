const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
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
      // Trả data realtime về client

      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        content: content,
        fullName: fullName,
      });
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
