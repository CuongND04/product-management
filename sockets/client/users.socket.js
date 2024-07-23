const User = require("../../models/user.model");

module.exports = (res) => {
  try {
    // console.log(res.locals.user.id);
    const userIdA = res.locals.user.id;

    _io.once("connection", (socket) => {
      // Khi A gửi yêu cầu cho B
      socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
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
      // Hết Khi A gửi yêu cầu cho B

      // Khi A hủy gửi yêu cầu cho B
      socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
        // Xóa id của A trong acceptFriends của B
        await User.updateOne(
          {
            _id: userIdB,
          },
          {
            $pull: { acceptFriends: userIdA },
          }
        );

        // Xóa id của B trong requestFriends của A
        await User.updateOne(
          {
            _id: userIdA,
          },
          {
            $pull: { requestFriends: userIdB },
          }
        );
      });
      // Hết Khi A hủy gửi yêu cầu cho B
    });
  } catch (error) {
    console.log(error);
  }
};
