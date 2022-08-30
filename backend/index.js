const app = require("./app");
const { connectDatabase } = require("./utils/database");

connectDatabase();

const PORT = process.env.PORT || 7000;

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {

  // console.log("Connection established");
  socket.on("setup", (user) => {
    socket.join(user._id);
    // console.log("Room joined " + user._id);
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    // console.log("User joined: " + room);
  });

  socket.on("typing", (room) => socket.broadcast.to(room).emit("typing"));
  socket.on("stop_typing", (room) => socket.broadcast.to(room).emit("stop_typing"));

  socket.on("new_message", (message) => {
    let chat = message.chat;
    if (!chat.users) return console.log("chat.users is empty");

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit("message_received", message);
    });
  });

  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(user._id);
  });
});
