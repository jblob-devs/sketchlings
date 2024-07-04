const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const socket = io();
console.log("connected to server");
let globalID = "";
//const scoreEl = document.querySelector('#scoreEl')
socket.on("connect", () => {
  console.log(socket.id);
  globalID = socket.id;
});
canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;
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
  }

  

  draw() {
    const imageP = new Image();
    if(this.action == 'still'){
      this.direction = 'none'
      imageP.src = moveAnimation(this.type, this.color, this.direction, this.animframe)
      c.drawImage(imageP, this.x, this.y);
      
    }else if(this.action == 'move'){

      if (this.direction == "right") {
        console.log(this.animframe)
          if(this.timerout == null){
            this.timerout = 'timer'
            setTimeout(function(){
       
                this.animframe += 1;
            
              if(this.animframe > 4){
                this.animframe = 1
              }
            
              this.timerout = null;
              console.log(this.animframe)
            },1000)
            
            
          }
          console.log(this.timerout)
          imageP.src = moveAnimation(this.type, this.color, this.direction, this.animframe)

        c.drawImage(imageP, this.x, this.y);
   
      } else if (this.direction == "left") {
        imageP.src = this.image + "standing.png";
        c.drawImage(imageP, this.x, this.y);
      }else if(this.direction == 'none'){
        imageP.src = this.image + "standing.png";
        c.drawImage(imageP, this.x, this.y);
      }
  
    }
    

  }
}
var triangleDefault = "/images/characters/triangle/gray/";
var playerdefault = triangleDefault + "standing.png";


const players = {};
socket.on("updatePlayers", (backendPlayers) => {
  for (const playerID in backendPlayers) {
    const backendPlayer = backendPlayers[playerID];
    if (!players[playerID]) {
      players[playerID] = new Player(
        backendPlayer.x,
        backendPlayer.y,
        backendPlayer.image,
        'triangle'
      );
    } else {
      // if (!playerID === globalID) {
      players[playerID].x = backendPlayer.x;
      players[playerID].y = backendPlayer.y;
      // }
      //players[playerID].image = backendPlayer.image;
    }
  }

  for (const id in players) {
    if (!backendPlayers[id]) {
      delete players[id];
    }
  }
  /*
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
*/
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

var playerspeed = 3;

setInterval(() => {
  if (keys.w.pressed) {
    players[socket.id].action = "move";
    players[socket.id].y -= playerspeed;
    socket.emit("keypress", "KeyW");
  }
  if (keys.a.pressed) {
    players[socket.id].x -= playerspeed;
    players[socket.id].action = "move";
    players[socket.id].direction = "left";
    socket.emit("keypress", "KeyA");
  }
  if (keys.s.pressed) {
    players[socket.id].y += playerspeed;
    players[socket.id].action = "move";
    socket.emit("keypress", "KeyS");
  }
  if (keys.d.pressed) {
    players[socket.id].x += playerspeed;
    players[socket.id].direction = "right";
    players[socket.id].action = "move";
    socket.emit("keypress", "KeyD");
  }
}, 15);

window.addEventListener("keydown", (event) => {
  if (!players[socket.id]) return;

  console.log(players);

  switch (event.code) {
    case "KeyW":
    
      keys.w.pressed = true;
      break;

    case "KeyA":
      
      keys.a.pressed = true;
      break;

    case "KeyS":
  
      keys.s.pressed = true;
      break;

    case "KeyD":

      keys.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  if (!players[socket.id]) return;

  switch (event.code) {
    case "KeyW":
      console.log("w up");
      players[socket.id].direction = "none";
      players[socket.id].action = "still";
      keys.w.pressed = false;
      break;

    case "KeyA":
      console.log("a up");
      players[socket.id].direction = "none";
      players[socket.id].action = "still";
      keys.a.pressed = false;
      break;

    case "KeyS":
      console.log("s up");
      players[socket.id].direction = "none";
      players[socket.id].action = "still";
      keys.s.pressed = false;
      break;

    case "KeyD":
      console.log("d up");
      players[socket.id].direction = "none";
      players[socket.id].action = "still";
      keys.d.pressed = false;
      break;
  }
});

function moveAnimation(ctype, color, direction, frame){
  let img = "/images/characters/" + ctype+ "/" + color + "/"
  if(direction == 'right'){
    img +=  'runrightframe' + frame
  }else if(direction == 'none'){
    img += 'standing'
  }
  console.log(img + '.png')
  return img + '.png';
}

function update() {
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all players
  for (let id in players) {
      players[id].draw();
  }
 
  // Request the next frame
  requestAnimationFrame(update);
}

update();
