canvas=document.querySelector('canvas');
ctx=canvas.getContext('2d');

canvas.width=1280;
canvas.height=720;

class Background {
    constructor(){
        this.img = new Image();
        this.path = "./res/img/pozadi2.png";
        this.img.src = this.path;
    }

    draw(ctx, canvas) {
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

    }
}
const background=new Background();

//čas hry
let timer=60;
function gameTime(){   
    if(timer>0){
        timer--;
        setTimeout(gameTime, 1000);  
        document.querySelector('#timer').innerHTML=timer;
    }
    //hra rozhodne podle HP kdo vyhrál
    if(timer===0){
        if(blue.health===red.health){
            document.querySelector('#text').innerHTML='TIE';    
        }
        else if(blue.health>red.health){
            document.querySelector('#text').innerHTML='BLUE WIN';
        }
        else {
            document.querySelector('#text').innerHTML='RED WIN';
        }
    }
}
gameTime();

const gravity = 0.7
class Player{
    constructor({position,velocity,color,swordSide}){
        this.position = position
        this.velocity = velocity
        this.height = 150   //výška hráče
        this.width = 50     //šířka hráče
        this.health = 100;  //životy hráče
        this.color = color;
        this.attacking
        this.sword={
            position:{
                x: this.position.x,
                y: this.position.y
            },
            swordSide,
            width:100,
            height:50,
        }
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

        //meč
        if(this.attacking){
            ctx.fillStyle = 'silver';
            ctx.fillRect(this.sword.position.x, this.sword.position.y, this.sword.width, this.sword.height)
        }
        
    }
    update(){
        this.draw()
        this.sword.position.x=this.position.x-this.sword.swordSide.x
        this.sword.position.y=this.position.y-this.sword.swordSide.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height-50){ //padání
            this.velocity.y = 0
        }else{
            this.velocity.y += gravity
        }
    }
    attack(){
        this.attacking=true
        setTimeout(()=>{
        this.attacking=false
        }, 100)
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
    swordSide:{
        x: 0,
        y: 0
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
    swordSide:{
        x: 0,
        y: 0
    },
    color: 'red',
})

console.log(blue)

const keys={ //zlepšení pohybu
    a:{
        down:false
    },
    d:{
        down:false
    },
    ArrowRight:{
        down:false
    },
    ArrowLeft:{
        down:false
    }
}
let blueLastKey
let redLastKey

function animate(){ //nekonečný loop
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    background.draw(ctx, canvas)
    blue.update()
    red.update()
    window.requestAnimationFrame(animate)

    //pohyb modrého
    blue.velocity.x=0;
    if(keys.d.down&&blueLastKey==='d'){
        blue.velocity.x=4;
    }
    else if(keys.a.down&&blueLastKey==='a'){
        blue.velocity.x=-4;
    }

    //pohyb červeného
    red.velocity.x=0;
    if(keys.ArrowRight.down && redLastKey==='ArrowRight'){
        red.velocity.x=4;
    }
    else if(keys.ArrowLeft.down && redLastKey==='ArrowLeft'){
        red.velocity.x=-4;
    }

    //zjištění zásahu
    if(blue.sword.position.x+blue.sword.width>=red.position.x   &&
        blue.sword.position.x<=red.position.x+red.width         &&
        blue.sword.position.y+blue.sword.height>=red.position.y &&
        blue.sword.position.y<=red.position.y+red.height        &&
        blue.attacking){
            blue.attacking=false;
            red.health -= 5;
            document.querySelector('#RedHealth').style.width = red.health + '%';
        if(red.health==0){
            document.querySelector('#text').innerHTML='BLUE WIN';
            red.height=50
            red.width=150
        }
    }
    if(red.sword.position.x+red.sword.width>=blue.position.x    &&
        red.sword.position.x<=blue.position.x+blue.width        &&
        red.sword.position.y+red.sword.height>=blue.position.y  &&
        red.sword.position.y<=blue.position.y+blue.height       &&
        red.attacking){
            red.attacking=false;
            blue.health -= 5;
            document.querySelector('#BlueHealth').style.width = blue.health + '%';
            if(blue.health==0){
                document.querySelector('#text').innerHTML='RED WIN'; 
                blue.height=50
                blue.width=150
            }
    }
}

animate()

window.addEventListener('keydown',(event)=>{ //pohyb hráčů
    switch(event.key){
        case 'd':
            keys.d.down=true
            blueLastKey='d'
            blue.sword.swordSide.x=0;
            break;
        case 'a':
            keys.a.down=true
            blueLastKey='a'
            blue.sword.swordSide.x=50;
            break;
        case 'w':
            blue.velocity.y=-14
            break;
        case 's':
            blue.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.down=true
            redLastKey='ArrowRight'
            red.sword.swordSide.x=0;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.down=true
            redLastKey='ArrowLeft'
            red.sword.swordSide.x=50;
            break;
        case 'ArrowUp':
            red.velocity.y=-14
            break;
        case 'ArrowDown':
            red.attack();
            break;
    }
})

window.addEventListener('keyup',(event)=>{ //vynulovani pohybu
    switch(event.key){
        case 'd':
            keys.d.down=false
            break;
        case 'a':
            keys.a.down=false
            break;
        case 'w':
            keys.w.down=false
            break;

        case 'ArrowRight':
            keys.ArrowRight.down=false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.down=false
            break;
        case 'ArrowUp':
            keys.ArrowUp.down=false
            break;
    }
})