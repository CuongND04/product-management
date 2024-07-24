const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;
  _io.once("connection", (socket) => {
    // Add user vào phòng chat
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        room_chat_id: roomChatId,
        images: images,
      });
      // lưu vào database
      await chat.save();
      // Trả data realtime về client

      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        content: data.content,
        images: images,
        fullName: fullName,
      });
    });

    // CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End CLIENT_SEND_TYPING
  });
};
