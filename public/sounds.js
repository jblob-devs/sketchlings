
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

let lobbymusicArr = [new sound('audio/music/cowsonwheels.mp3'), new sound('audio/music/batsinhouses.mp3'), new sound('audio/music/camelonthebeach.mp3'),  new sound('audio/music/downunder.mp3'), new sound('audio/music/palmsandall.mp3'), new sound('audio/music/melancholybreeze.mp3')];
let curSong = 0;
$("#toggleMusic").on('click', function(){
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