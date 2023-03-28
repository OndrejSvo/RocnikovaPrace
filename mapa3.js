canvas=document.querySelector('canvas');
ctx=canvas.getContext('2d');

canvas.width=1280;
canvas.height=720;

class Background {
    constructor(){
        this.img = new Image();
        this.path = "./res/img/pozadi3.png";
        this.img.src = this.path;
    }

    draw(ctx, canvas) {
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

    }
}
const background=new Background();

const gravity = 0.7
class Player{
    constructor({position,velocity,color}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.color = color;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        this.draw()
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height-50){
            this.velocity.y = 0
        }else{
            this.velocity.y += gravity
        }
    }
}

const blue = new Player({
    position:{
        x:0,
        y:350
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'blue',
})

const red = new Player({
    position:{
        x:canvas.width-50,
        y:350
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'red',
})

console.log(blue)


function animate(){
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.draw(ctx, canvas)
    blue.update()
    red.update()
    window.requestAnimationFrame(animate)
}

animate()