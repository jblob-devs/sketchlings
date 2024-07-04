const express = require("express");
const app = express();
const port = 3000;

// setting up socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {pingInterval: 1000, pingTimeout: 3000});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

class Player {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }
}

const players = {};
var playerimage = "/images/characters/triangle/gray/trianglegraystanding.png";
io.on("connection", (socket) => {
  console.log("player connected");

  players[socket.id] = new Player(Math.random()*500, Math.random()*500, playerimage);
  io.emit("updatePlayers", players);

  console.log(players);

  socket.on("disconnect", (reason) => {
    console.log("player disconnected: " + reason);

    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log(players)
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
