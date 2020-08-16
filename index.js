var io = require("socket.io")();

io.on("connection", function(socket) {
  console.log("online id: " + socket.id);
  socket.broadcast.emit("online", { id: socket.id });

  socket.on("disconnect", function() {
    console.log("offline id: " + socket.id);
    socket.broadcast.emit("offline", { id: socket.id });
  });

  socket.on("message", function(obj) {
    var id = socket.id;
    var message = obj.message;

    console.log(
      "message id: " +
        id +
        " message: " +
        message +
        " posX: " +
        obj.x +
        " posY: " +
        obj.y
    );
    io.emit("message", { id: id, message: message });
    io.to(id).emit("message", { id: "", message: "return" });
  });
  socket.on("move", function(obj) {
    var id = socket.id;
    var pos_x = obj.x;
    var pos_z = obj.z;

    console.log("message id: " + id + " posX: " + obj.x + " posz: " + obj.z);
    //io.emit("move", { id: id, x: pos_x, z: pos_z });
    socket.broadcast.emit("move", { id: id, x: pos_x, z: pos_z });
  });
});

io.listen(4567);
