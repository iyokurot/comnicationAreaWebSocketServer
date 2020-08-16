var io = require('socket.io')()

let userList = [{ id: '2', pos_x: 1.0, pos_z: 2.0 }]

io.on('connection', function(socket) {
  console.log('online id: ' + socket.id)
  // アクティブユーザーへログイン通知
  socket.broadcast.emit('online', { id: socket.id })
  io.to(socket.id).emit('login_users', {
    id: '',
    message: JSON.stringify({ users: userList }),
  })
  // 配列へ追加
  userList.push({ id: socket.id, pos_x: 0, pos_z: 0 })

  // ログアウト
  socket.on('disconnect', function() {
    console.log('offline id: ' + socket.id)
    socket.broadcast.emit('offline', { id: socket.id })
    // 配列から削除
    logoutUser(socket.id)
  })

  socket.on('message', function(obj) {
    var id = socket.id
    var message = obj.message

    console.log(
      'message id: ' +
        id +
        ' message: ' +
        message +
        ' posX: ' +
        obj.x +
        ' posY: ' +
        obj.y,
    )
    io.emit('message', { id: id, message: message })
    io.to(id).emit('message', { id: '', message: 'return' })
  })

  // プレイヤーが移動
  socket.on('move', function(obj) {
    var id = socket.id
    var pos_x = obj.x
    var pos_z = obj.z

    console.log('message id: ' + id + ' posX: ' + obj.x + ' posz: ' + obj.z)
    //io.emit('move', { id: '2', x: pos_x + 1.0, z: pos_z + 1.0 })
    // 他ユーザへ通知
    socket.broadcast.emit('move', { id: id, x: pos_x, z: pos_z })
    // 配列内容変更
    updatePosition(id, pos_x, pos_z)
  })
})

function updatePosition(id, pos_x, pos_z) {
  userList.forEach(user => {
    if (user.id == id) {
      user.pos_x = pos_x
      user.pos_z = pos_z
      return
    }
  })
}

function logoutUser(id) {
  userList = userList.filter(user => {
    return user.id != id
  })
}

io.listen(4567)
