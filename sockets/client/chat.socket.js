const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = async (res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      // lưu vào database
      await chat.save();
      // Trả data realtime về client

      _io.emit("SERVER_RETURN_MESSAGE", {
        user_id: userId,
        content: data.content,
        images: images,
        fullName: fullName,
      });
    });

    // CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    // End CLIENT_SEND_TYPING
  });
};
