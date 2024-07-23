const User = require("../../models/user.model");

module.exports = (res) => {
  const userIdA = res.locals.user.id;
  _io.once("connection", (socket) => {
    // Khi A gửi yêu cầu cho B
    socket.on("CLIENT_ADD_FRIREND", async (userIdB) => {
      // Thêm id của A vào acceptFriends của B

      // kiểm tra lời mời tồn tại chưa
      const existAInB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA,
      });

      if (!existAInB) {
        await User.updateOne(
          {
            _id: userIdB,
          },
          {
            $push: { acceptFriends: userIdA },
          }
        );
      }

      // Thêm id của B vào requestFriends của A
      const existBInA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB,
      });

      if (!existBInA) {
        await User.updateOne(
          {
            _id: userIdA,
          },
          {
            $push: { requestFriends: userIdB },
          }
        );
      }
    });
  });
};
