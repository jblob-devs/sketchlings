
let frontProjectiles = []


class Projectile{
    constructor({x , y , image, velocity}){
        this.x = x
        this.y = y
        this.image = image
        this.velocity = velocity
    }
    draw(){
        let img = new Image()
        img.src = this.image
        c.drawImage(img, this.x, this.y)
    }
    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}


