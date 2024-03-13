const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require('http')
const server = http.createServer(app)

app.use(cors())
app.get('/video', (req, res) => {
    res.sendFile('assets/video1.mp4', { root: __dirname });
});

//videos route
const Videos = require('./routes/Videos')
app.use('/videos', Videos)

server.listen(80, '0.0.0.0', () => {
    console.log(server.address())
});

const io = require('socket.io')(server, {
    allowEIO3: true,
    cors: {
      origin: "*",
      methods: ["GET"]
    }
});

// Socket
var connectedCount = 0;
const ROOM = "lounge"

io.on('connect', (socket) => {
  connectedCount++;

  console.log(io.of("/").adapter.rooms)

  socket.on("join-room", () => {
    console.log("join room received")
    if (connectedCount > 1) {
      var controllerSock = getControllerSocket()
      if (controllerSock) {
        console.log("found controller")
        controllerSock.emit('requested_seek', socket.id)
      } else {
        console.log("no controller")
      }
    }
    socket.join(ROOM)
  })
  socket.on("connect_error", err => console.log(`serv connect_error due to ${err.message}`));
  socket.on('broadcast_state_changed', data => {
    socket.broadcast.to(ROOM).emit('seek', data)
  });
  socket.on('seek_others', data => {
    socket.broadcast.to(ROOM).emit("seek", data)
  });
  socket.on('seek_other', data => {
    console.log(data.other, "seeking")
    socket.broadcast.to(data.other).emit("seek", data)
  });
  socket.on('disconnect', () => {
    connectedCount--;
    console.log(socket.id, "disconnected")
  });
  console.log(socket.id, 'Socket connection established. Connected: ' + connectedCount)
})

function getControllerSocket() {
  var room = io.of("/").adapter.rooms.get(ROOM)
  if (room == undefined || room.length == 0) {
    return undefined;
  }
  const [first] = room
  return io.sockets.sockets.get(first);
}