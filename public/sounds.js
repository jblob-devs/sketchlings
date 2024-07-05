
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

let lobbymusicArr = [sound('audio/music/cowsonwheels.mp3'), sound('audio/music/batsinhouses.m4a'), sound('audio/music/camelonthebeach.mp3'), sound('audio/music/downunder.mp3'), sound('audio/music/tropicalpalms.mp3'), sound('audio/music/melancholybreeze.mp3')];
let curSong = 0;
$("#toggleMusic").on('click', function(){
  if(!lobbymusictoggled){
    lobbymusictoggled = true;
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