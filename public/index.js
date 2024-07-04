const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//const scoreEl = document.querySelector('#scoreEl')

canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;
class Player {
    constructor(x, y, image) {
      this.x = x;
      this.y = y;
      this.image = image;
    }
  }
var playerdefault = "/images/characters/triangle/gray/trianglegraystanding.png";

const player = new Player(x, y, playerdefault);

const players = {}
socket.on("updatePlayers", (backendPlayers) => {
  
  for (const playerID in backendPlayers) {
    const backendPlayer = backendPlayers[playerID];
    if (!players[playerID]) {
      players[playerID] = new Player(backendPlayer.x, backendPlayer.y, backendPlayer.image);
    }
  }
  console.log(backendPlayers);

  for (const id in players){
    if(!backendPlayers[id]){
      delete players[id]
      
    }
    console.log(players)
  }
  
setInterval(function () {
  //console.log("po");
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (const playerID in players) {

    const player = players[playerID];

    const image = new Image();
    image.src = player.image
  
    //console.log("going to draw");
    
    c.drawImage(image, player.x, player.y)

  }
}, 10);


});



