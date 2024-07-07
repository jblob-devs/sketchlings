//function for sounds
function sound(src) {
  this.sound = document.createElement("AUDIO");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.setAttribute("loop", "autoplay");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

let lobbymusicArr = []
let curSong = 0;

socket.on('sendLobbyMusic', (musiclist)=>{
  let arr;
  for(let i in musiclist){
    arr[i] = new sound("audio/music/lobby/" + musiclist[i])
  }
  console.log(arr)
  lobbymusicArr = arr
})


$("#toggleMusic").on('click', function(){
  console.log(lobbymusicArr)
  if(!lobbymusictoggled){
    lobbymusictoggled = true;
    $("#toggleMusic").css('background-color', 'green')
    lobbymusicArr[curSong].play();
  }
  if(lobbymusictoggled){
    lobbymusicArr[curSong].stop()
    curSong++;
    if(curSong == lobbymusicArr.length){
      curSong = 0;
      lobbymusicArr[curSong].play();
    }
    else{
      lobbymusicArr[curSong].play();
    }
  }
  
})

if(lobbymusicArr[curSong].ended){
  curSong++;
    if(curSong == lobbymusicArr.length){
      curSong = 0;
      lobbymusicArr[curSong].play();
    }
    else{
      lobbymusicArr[curSong].play();
    }
}

