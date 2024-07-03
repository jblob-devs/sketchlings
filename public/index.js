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

socket.on("updatePlayers", (players) => {
  console.log(players);
  for (const playerID in players) {
    const p1 = players[playerID];
    if (!players[playerID]) {
      players[playerID] = new Player(p1.x, p1.y, p1.image);
    }


  }
  setInterval(function () {
    console.log("po");
    for (const playerID in players) {
      const player = players[playerID];

    const image = new Image();
    image.src = player.image
      console.log("going to draw");
     
      c.drawImage(image, player.x, player.y)
    }
  }, 3000);



});

