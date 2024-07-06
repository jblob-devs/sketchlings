const express = require("express");
const app = express();
const port = 3000;

// setting up socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 1000, pingTimeout: 3000 });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

class Player {
  constructor(x, y, image, type) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.type = type;
    this.direction = "none";
    this.action = 'still'
    this.color = 'gray'
    this.animframe = 1;
    this.timerout = null;
    this.room = 0;
  }

}

const backplayers = {};

var triangleDefault = "/images/characters/triangle/gray/standing1";
var circleDefault;
var squareDefault;
var playerimage = triangleDefault;
var playerSpeed = 2;
//players speed is 2

io.on("connection", (socket) => {
  console.log("player connected");

  backplayers[socket.id] = new Player(100, 100, playerimage, 'triangle');
  io.emit("updatePlayers", backplayers);

  //console.log(backplayers);

  socket.on("disconnect", (reason) => {
    console.log("player disconnected: " + reason);
    delete backplayers[socket.id];
    io.emit("updatePlayers", backplayers);
    //console.log(backplayers)
  });

  //move player
  socket.on("keypress", (keycode) => {
    this.action = 'move'
    switch (keycode) {
      case "KeyW":
        backplayers[socket.id].y -= playerSpeed;
        break;
      case "KeyA":
        this.direction = 'left'
        backplayers[socket.id].x -= playerSpeed;
       // backplayers[socket.id].direction = 'left'
        break;
      case "KeyS":
        backplayers[socket.id].y += playerSpeed;
        break;
      case "KeyD":
        this.direction = 'right'
        backplayers[socket.id].x += playerSpeed;
        //backplayers[socket.id].direction = 'right'
        break;
    }
  });

  socket.on('updateAnim', (imageemitted) =>{
    backplayers[socket.id].image = imageemitted;
  })

  socket.on('keyup', () => {
    backplayers[socket.id].direction = 'none'
    backplayers[socket.id].action = 'still'
  })

});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

setInterval(() => {
  io.emit("updatePlayers", backplayers);
}, 15);