
//function for sounds

function sound(src) {
    this.sound = document.createElement("audio");
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
  

let lobbymusic = new sound('audio/music/cowsonwheels.mp3')

$("#toggleMusic").on('click', function(){
  if(lobbymusictoggled){
    lobbymusictoggled  = false;
    $("#toggleMusic").css("background-color", 'red')
    lobbymusic.stop()
  }else{
    lobbymusic.play()
    lobbymusictoggled = true;
    $("#toggleMusic").css("background-color", 'green')
  }
})