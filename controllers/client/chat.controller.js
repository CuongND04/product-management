// [GET] /chat/
module.exports.index = async (req, res) => {
  // SocketIO
  _io.on("connection", (socket) => {
    console.log("Có 1 user kết nối", socket.id);
  });
  // END SocketIO
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
