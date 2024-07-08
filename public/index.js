const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const socket = io();
console.log("connected to server");
let globalID = "";

$(document).ready(function () {
  Swal.fire({
    title: "Sketchlings",
    text: "input your username!",
    allowOutsideClick: false,
    imageUrl: "images/characters/triangle/gray/standing1.png",
    input: "text",
    inputPlaceholder: "Username",
    inputAttributes: {
      maxlength: "15"
      ,
    },
  }).then((result) => {
    socket.emit("intializeGame", result.value);
  });
});

//const scoreEl = document.querySelector('#scoreEl')
socket.on("connect", () => {
  // socket.emit('intializeGame', '')
  console.log("SID", socket.id);
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
    this.action = "still";
    this.color = "gray";
    this.animframe = 1;
    this.timerout = null;
    this.room = 0;
    this.username = "";
  }

  draw() {
    //console.log(this.action)

    if (this.action == "still") {
      // console.log('<--- Counter: Amt of rights sairam has lost')
      this.image = moveAnimation(
        this.type,
        this.color,
        "still",
        this.animframe
      );
      //c.drawImage(imageP, this.x, this.y);
    } else if (this.action == "move") {
      if (this.direction == "right" || this.direction == "left") {
        if (this.timerout == null) {
          this.timerout = "done";
          var that = this;

          setInterval(function () {
            that.animframe++;

            if (that.animframe > 4) {
              that.animframe = 1;
            }
          }, 75);
        }

        this.image = moveAnimation(
          this.type,
          this.color,
          this.direction,
          this.animframe
        );
        //c.drawImage(imageP, this.x, this.y);
      }
    }

    //imageP.src = 'images/characters/triangle/gray/runrightframe4.png'
    //console.log(this.image)
    socket.emit("updateAnim", this.image);
  }
}

let room = 0;
const players = {};
let curRoom = -1;

socket.on("updatePlayers", (backendPlayers) => {
  for (let playerID in backendPlayers) {
    let backendPlayer = backendPlayers[playerID];
    if (!players[playerID]) {
      players[playerID] = new Player(
        backendPlayer.x,
        backendPlayer.y,
        backendPlayer.image,
        "triangle",
        backendPlayer.room
      );
      //console.log(backendPlayer.room)
    } else {
      if (playerID == socket.id) {
        players[playerID].x = backendPlayer.x;
        players[playerID].y = backendPlayer.y;
        //players[playerID].image = backendPlayer.image;
        players[playerID].direction = backendPlayer.direction;
        players[playerID].action = backendPlayer.action;
        players[playerID].room = backendPlayer.room;
        players[playerID].username = backendPlayer.username;
      } else {
        players[playerID].x = backendPlayer.x;
        players[playerID].y = backendPlayer.y;
        players[playerID].direction = backendPlayer.direction;
        players[playerID].action = backendPlayer.action;
        players[playerID].room = backendPlayer.room;
        players[playerID].username = backendPlayer.username;
        //players[playerID].image = backendPlayer.image;
      }
    }
    if (curRoom != players[playerID].room) {
      //call change room function
      curRoom = players[playerID].room;
    }
    // console.log(players)

    players[playerID].image = backendPlayer.image;
    // console.log(players[playerID].image)
  }

  for (const id in players) {
    if (!backendPlayers[id]) {
      console.log("deleting player", id);
      delete players[id];
    }
  }
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
  space: {
    pressed: false,
  },
};

setInterval(() => {
  if (!players[socket.id]) return;
  if (keys.w.pressed) {
    socket.emit("keypress", "KeyW");
  }
  if (keys.a.pressed) {
    socket.emit("keypress", "KeyA");
  }
  if (keys.s.pressed) {
    socket.emit("keypress", "KeyS");
  }
  if (keys.d.pressed) {
    socket.emit("keypress", "KeyD");
  }
  if (keys.space.pressed) {
    socket.emit("keypress", "Space");
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
    case "Space":
      keys.space.pressed = true;
      break;
  }
});
//joy stick

window.addEventListener("keyup", (event) => {
  if (!players[socket.id]) return;
  switch (event.code) {
    case "KeyW":
      socket.emit("keyup");
      keys.w.pressed = false;
      break;

    case "KeyA":
      socket.emit("keyup");
      keys.a.pressed = false;
      break;

    case "KeyS":
      socket.emit("keyup");
      keys.s.pressed = false;
      break;

    case "KeyD":
      socket.emit("keyup");
      keys.d.pressed = false;
      break;
    case "Space":
      keys.space.pressed = false;
      break;
  }
});

function moveAnimation(ctype, color, direction, frame) {
  let img = "/images/characters/" + ctype + "/" + color + "/";
  if (direction == "still") {
    img += "standing1";
  } else if (direction == "right") {
    img += "runrightframe" + frame;
  } else if (direction == "left") {
    img += "runleftframe" + frame;
  }

  return img + ".png";
}
function update() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  //console.log('ue')
  // Draw all players
  drawRoom(curRoom);
  for (let id in players) {
    //console.log(players[id].room)
    if (players[id].room != curRoom) {
      continue;
    }
    //console.log(players)
    players[id].draw();
    //console.log(players)
    let newimg;
    newimg = new Image();
    newimg.src = players[id].image;
    //console.log(players[id].image)
    // newimg.src = testingimage
    //  console.log(players[id].image)
    c.drawImage(newimg, players[id].x, players[id].y);
    let len = players[id].username.length;
    c.fillText(
      players[id].username,
      players[id].x - 2 * len,
      players[id].y - 10
    );
  }
  c.font = "17px Comfortaa";

  // Request the next frameaw
  requestAnimationFrame(update);
}

function changeRoom(r) {
  socket.emit("changeRoom", r);
  room = r;
}

function drawRoom(curRoom) {
  let img = new Image();
  if (curRoom == 0) {
    img.src = "images/miscassets/boombox.png";

    c.drawImage(img, 700, 200, 150, (150 * img.height) / img.width);
  }
}
update();
