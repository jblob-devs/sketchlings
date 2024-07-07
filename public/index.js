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

  constructor(x, y, image, type, room) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.type = type;
    this.direction = "none";
    this.action = 'cheese'
    this.color = 'gray'
    this.animframe = 1;
    this.timerout = null;
    this.room = 0;

    console.log(this.action)
  }

  draw() {

    const imageP = new Image();

    console.log(this.action)

    if(this.action == 'still'){
      
      // console.log('<--- Counter: Amt of rights sairam has lost')
      imageP.src = moveAnimation(this.type, this.color, 'still', this.animframe)
      //c.drawImage(imageP, this.x, this.y);

    }else if(this.action == 'move'){

      if (this.direction == "right" || this.direction == "left" ) {
        
        if(this.timerout == null){
          this.timerout = "done"
          var that = this

          setInterval(function(){
            
            that.animframe++;

            if(that.animframe > 4){
              that.animframe = 1
            }

          }, 75)

        }
        
        imageP.src = moveAnimation(this.type, this.color, this.direction, this.animframe)
        //c.drawImage(imageP, this.x, this.y);

      }
    }

  //imageP.src = 'images/characters/triangle/gray/runrightframe4.png'
  
   socket.emit('updateAnim', imageP.src)
    
  }

}

let room = 0;
const players = {};

socket.on("updatePlayers", (backendPlayers) => {
  for (const playerID in backendPlayers) {
    const backendPlayer = backendPlayers[playerID];
    if (!players[playerID]) {
      players[playerID] = new Player(
        backendPlayer.x,
        backendPlayer.y,
        backendPlayer.image,
        'triangle',
        backendPlayer.room
      )
      console.log(backendPlayer.room)
    } else {
      players[playerID].x = backendPlayer.x;
      players[playerID].y = backendPlayer.y;
      players[playerID].image = backendPlayer.image;
      players[playerID].direction = backendPlayer.direction;
      players[playerID].action = backendPlayer.action;
      players[playerID].room = backendPlayer.room;
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
update();
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

var playerspeed = 2;

setInterval(() => {
  if (!players[socket.id]) return;
  if (keys.w.pressed) {
    players[socket.id].y -= playerspeed;
    socket.emit("keypress", "KeyW");
  }
  if (keys.a.pressed) {
    players[socket.id].x -= playerspeed;
    socket.emit("keypress", "KeyA");
  }
  if (keys.s.pressed) {
    players[socket.id].y += playerspeed;
    socket.emit("keypress", "KeyS");
  }
  if (keys.d.pressed) {
    players[socket.id].x += playerspeed;
    socket.emit("keypress", "KeyD");
  }
}, 15);

window.addEventListener("keydown", (event) => {

  if (!players[socket.id]) return;

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
//joy stick


window.addEventListener("keyup", (event) => {

  if (!players[socket.id]) return;
  switch (event.code) {
 
    case "KeyW":
      socket.emit('keyup')
      keys.w.pressed = false;
      break;

    case "KeyA":
      socket.emit('keyup')
      keys.a.pressed = false;
      break;

    case "KeyS":
      socket.emit('keyup')
      keys.s.pressed = false;
      break;

    case "KeyD":
      socket.emit('keyup')
      keys.d.pressed = false;
      break;
  }
});

function moveAnimation(ctype, color, direction, frame){
  let img = "/images/characters/" + ctype+ "/" + color + "/"
  if(direction == 'still'){
   img += 'standing1'
  }
  else if(direction == 'right'){
    img +=  'runrightframe' + frame
  }else if(direction == 'left'){
    img += 'runleftframe' + frame
  }

 
  return img + '.png';
}
function update() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  //console.log('ue')
  // Draw all players
  let newimg;
  for (let id in players) {
    //console.log(players)
    players[id].draw();
    //console.log(players)
    newimg = new Image()
    newimg.src = players[id].image
   // newimg.src = testingimage
    c.drawImage(newimg, players[id].x, players[id].y)
  }
 
  // Request the next frame
  //requestAnimationFrame(update);
}

//setInterval(update, 15)

function changeRoom(num){
  room = num;
  players[socket.id].room = room;
}



