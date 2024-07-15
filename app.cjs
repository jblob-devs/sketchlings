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
    this.username = '';
  }

  changeRoom(room) {
    this.room = room;
  }

}

const backplayers = {};
const backProjectiles = {};
let projectileId = 0;

var triangleDefault = "/images/characters/triangle/gray/standing1.png";
var circleDefault;
var squareDefault;
var playerimage = triangleDefault;
var playerSpeed = 2;
//players speed is 2

io.on("connection", (socket) => {
  console.log("player connected");

  socket.on('intializeGame', (result)=>{
    backplayers[socket.id] = new Player(getRandomInt(100,500), getRandomInt(100,500), playerimage, 'triangle');
    backplayers[socket.id].changeRoom(0);
    backplayers[socket.id].username = result
  })
  
  // io.emit("updatePlayers", backplayers);

  //console.log(backplayers);

  socket.on("disconnect", (reason) => {
    console.log("player disconnected: " + reason);
    delete backplayers[socket.id];
    io.emit("updatePlayers", backplayers);
    //console.log(backplayers)
  });

  //move player
  socket.on("keypress", (keycode) => {
    switch (keycode) {
      case "KeyW":
        backplayers[socket.id].action = 'move'
        backplayers[socket.id].y -= playerSpeed;
        break;
      case "KeyA":
        backplayers[socket.id].direction = 'left'
        backplayers[socket.id].action = 'move'
        backplayers[socket.id].x -= playerSpeed;
       // backplayers[socket.id].direction = 'left'
        break;
      case "KeyS":
        backplayers[socket.id].action = 'move'
        backplayers[socket.id].y += playerSpeed;
        break;
      case "KeyD":
        backplayers[socket.id].direction = 'right'
        backplayers[socket.id].action = 'move'
        backplayers[socket.id].x += playerSpeed;
        //backplayers[socket.id].direction = 'right'
        break;
      case "Space":
        console.log(backplayers[socket.id].x + " " + backplayers[socket.id].y);
        if (backplayers[socket.id].x <= 850 && backplayers[socket.id].x >= 650 && backplayers[socket.id].y >= 150 && backplayers[socket.id].y <= 300) {
          backplayers[socket.id].x = 600;
          backplayers[socket.id].y = 600;
        }
        break;
    }
  });

  socket.on('updateAnim', (imageemitted) =>{
    if (!backplayers[socket.id]) return;
    backplayers[socket.id].image = imageemitted;
  })
  
  socket.on('keyup', () => {
    backplayers[socket.id].action = 'still'
  })

  socket.on('changeRoom', (room) => {
    backplayers[socket.id].room = room;
    
  })
  socket.on('newUser', (username) => {
    io.emit('newUser', username)
  })

  var fs = require('fs');
  var lobbymusiclist = []

  fs.readdirSync('public/audio/music/lobby/').forEach(file => {
    lobbymusiclist.push(file)
    io.emit('sendLobbyMusic', lobbymusiclist)
  })

  socket.on('castPage', ({x, y, angle})=>{
    projectileId++

    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    }
    backProjectiles[projectileId] = {
      x,
      y,
      velocity,
      //who shooting the projectile!!! VVVV
      playerId: socket.id
    }
  })

  
});

//reads the files in lobby music and puts them in an array




server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


setInterval(() => {
  updateProjectiles()
  io.emit('updateProjectiles', backProjectiles)
  io.emit("updatePlayers", backplayers);
}, 15);

function updateProjectiles(){
  for (const id in backProjectiles){
    backProjectiles[id].x += backProjectiles[id].velocity.x
    backProjectiles[id].y += backProjectiles[id].velocity.y
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}