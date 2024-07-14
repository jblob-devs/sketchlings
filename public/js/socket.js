
const socket = io();
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");



socket.on("newUser", (name) => {
    if (allowEmit) {
      Toast.fire({
        icon: "success",
        title: name + " has joined the game",
      });
    }
  });
  
  //const scoreEl = document.querySelector('#scoreEl')
  socket.on("connect", () => {
    // socket.emit('intializeGame', '')
    console.log("SID", socket.id);
    globalID = socket.id;
  });

  
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
        // Toast.fire({
        //   icon: "success",
        //   title: backendPlayer.username + " has joined the game",
        // });
  
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
      
      if (curRoom != players[socket.id].room) {
      //   //call change room function
         curRoom = players[socket.id].room;
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
  

  
socket.on('sendLobbyMusic', (musiclist)=>{
    let arr = []
    for(let i in musiclist){
      arr[i] = new sound("audio/music/lobby/" + musiclist[i])
    }
    lobbymusicArr = arr
  })
  