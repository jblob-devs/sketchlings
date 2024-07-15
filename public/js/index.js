
console.log("connected to server");
let globalID = "";
let allowEmit = false;


$(document).ready(async function () {
  let name = "";
  Swal.fire({
    title: "Sketchlings",
    text: "input your username!",
    allowOutsideClick: false,
    imageUrl: "images/characters/triangle/gray/standing1.png",
    input: "text",
    
    inputPlaceholder: "Username",
    inputAttributes: {
      maxlength: "150",
    
    },
    inputValidator: async (value) => {
      if (!value) {
        randanimal = await getrandanimal();
        let randchance = getRandomInt(1, 3);
        randadj = await getrandadjectives(1)
        randnoun = await getrandomnoun()
        let word = ""
        if(randchance == 1){
          let randint = getRandomInt(0,11)
          let namearray = ['sir ',"dr. ","lord ", "count ", "king ", "queen ", "Master ", "chief ", "duke ", "president ", "primate ", "captain "]
          word = namearray[randint]
        }
        name = word + randadj + " " + randanimal
        socket.emit("newUser", name)
      }
    },
  }).then((result) => {
    if (result.value) {
      name = result.value;
    }
    allowEmit = true;
    socket.emit("intializeGame", name);
  });
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

async function getrandanimal() {
  let url = "https://random-word-form.herokuapp.com/random/animal?count=1";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data[0];
  } catch (error) {
    console.error("Failed to fetch random username:", error);
    return null;
  }
}

async function getrandomnoun() {
  let url = "https://random-word-form.herokuapp.com/random/noun?count=1";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data[0];
  } catch (error) {
    console.error("Failed to fetch random username:", error);
    return null;
  }
}


async function getrandadjectives(amount){
  let url = 'https://random-word-form.herokuapp.com/random/adjective'
  url += '?count=' + amount
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data[0];
  } catch (error) {
    console.error("Failed to fetch random username:", error);
    return null;
  }
}

let room = 0;
let curRoom = 0;
const players = {};
const projectiles = {}


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
  //clear the canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  // Draw objects in the current room
  drawRoom(curRoom);

  //loop thru players
  for (let id in players) {

    if (players[id].room != curRoom) {
      continue;
    }
    
    players[id].draw();
    let newimg;
    newimg = new Image();
    newimg.src = players[id].image;
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

const Toast = Swal.mixin({
  toast: true,
  position: "top-start",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

function changeRoom(r) {
  socket.emit("changeRoom", r);
  room = r;
}

function drawRoom(curRoom) {
  let img = new Image();
  if (curRoom == 0) {
    img.src = "images/miscassets/boombox.png";

    c.drawImage(img, 700, 200, 150, (150 * img.height) / img.width);
  }else if(curRoom == 1){
    if(allowEmit){
      Toast.fire({
        title:'Skirmish',
        text: "It's a free for all! Fight and survive!"
      })
    }
    

  }
}
update();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}


window.addEventListener('click', (event) => {
  if(!players[socket.id]){return}
    const pPosition = {
      x: players[socket.id].x,
      y: players[socket.id].y
    }
  
  const angle = Math.atan2(
    event.clientY * window.devicePixelRatio - pPosition.y,
    event.clientX * window.devicePixelRatio - pPosition.x,
  )
  socket.emit('castPage', {
    x: pPosition.x,
    y: pPosition.y,
    angle
  })

})

