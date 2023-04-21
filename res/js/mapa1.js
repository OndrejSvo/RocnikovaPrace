canvas=document.querySelector('canvas');
ctx=canvas.getContext('2d');

canvas.width=1280;
canvas.height=720;

class Background {
    constructor(){
        this.img = new Image();
        this.path = "./res/img/pozadi1.png";
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
            document.querySelector('#text').innerHTML='DRAW';    
        }
        else if(blue.health>red.health){
            document.querySelector('#text').innerHTML='BLUE WON';
        }
        else {
            document.querySelector('#text').innerHTML='RED WON';
        }
    }
}
gameTime();


const gravity = 0.7
class Player{
    constructor({position,velocity,color,swordSide,path,swordPath}){
        this.position = position
        this.velocity = velocity
        this.height = 226  //výška hráče
        this.width = 126     //šířka hráče
        this.health = 100;  //životy hráče
        this.color = color;
        this.attacking
        this.img = new Image();
        this.path = path;
        this.img.src = this.path;
        this.sword={
            position:{
                x: this.position.x,
                y: this.position.y
            },
            swordSide,
            width:100,
            height:50,
        }
        
        this.swordImg = new Image();
        this.swordPath= swordPath;
        this.swordImg.src = this.swordPath;        
    }
    draw(){
        //ctx.fillStyle = this.color;
        //ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);

        //meč
        if(this.attacking){
            //ctx.fillStyle = 'silver';
            //ctx.fillRect(this.sword.position.x, this.sword.position.y, this.sword.width, this.sword.height)
            ctx.drawImage(this.swordImg,this.sword.position.x, this.sword.position.y, this.sword.width, this.sword.height)    
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
        }, 500)
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
        x: 76,
        y: 0
    },
    color: 'blue',
    path:"./res/img/modra.png",
    swordPath:"./res/img/swordR.png"
})

const red = new Player({
    position:{
        x:canvas.width-126,
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
    path:"./res/img/cervena.png",
    swordPath:"./res/img/swordL.png"
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
    else if(keys.d.down&&blueLastKey==='D'){
        blue.velocity.x=4;
    }
    else if(keys.a.down&&blueLastKey==='A'){
        blue.velocity.x=-4;
    }

    //modrý nemůže mimo mapu
    if(blue.position.x<0){
        blue.position.x=0
    }
    if(blue.position.x>canvas.width-blue.width){
        blue.position.x=canvas.width-blue.width
    }
    if(blue.position.y<=0){
        blue.position.y=0;
    }

    //pohyb červeného
    red.velocity.x=0;
    if(keys.ArrowRight.down && redLastKey==='ArrowRight'){
        red.velocity.x=4;
    }
    else if(keys.ArrowLeft.down && redLastKey==='ArrowLeft'){
        red.velocity.x=-4;
    }

    //červený nemůže mimo mapu
    if(red.position.x<0){
        red.position.x=0
    }
    if(red.position.x>canvas.width-red.width){
        red.position.x=canvas.width-red.width
    }
    if(red.position.y<=0){
        red.position.y=0;
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
            document.querySelector('#text').innerHTML='BLUE WON';
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
                document.querySelector('#text').innerHTML='RED WON';      
            }
    }
}

animate()

window.addEventListener('keydown',(event)=>{ //pohyb hráčů
    console.log(event.key)
if((blue.health>0)&&(timer>0)&&(red.health>0)){
    switch(event.key){
        //klávesy modrého
        case 'd':
            keys.d.down=true
            blueLastKey='d'
            blue.sword.swordSide.x=-76;
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
        //klávesy modrého(caps lock)
        case 'D':
            keys.d.down=true
            blueLastKey='D'
            blue.sword.swordSide.x=-76;
            break;
        case 'A':
            keys.a.down=true
            blueLastKey='A'
            blue.sword.swordSide.x=50;
            break;
        case 'W':
            blue.velocity.y=-14
            break;
        case 'S':
            blue.attack();
            break;

        //klávesy červeného
        case 'ArrowRight':
            keys.ArrowRight.down=true
            redLastKey='ArrowRight'
            red.sword.swordSide.x=-76;
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
}
//červený vyhrál
if((blue.health<=0)&&(timer>0)&&(red.health>0)){
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.down=true
            redLastKey='ArrowRight'
            red.sword.swordSide.x=-76;
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
}
//modrý vyhrál
if((blue.health>0)&&(timer>0)&&(red.health<=0)){
    switch(event.key){
        //klávesy modrého
        case 'd':
            keys.d.down=true
            blueLastKey='d'
            blue.sword.swordSide.x=-76;
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
        //klávesy modrého(caps lock)
        case 'D':
            keys.d.down=true
            blueLastKey='D'
            blue.sword.swordSide.x=-76;
            break;
        case 'A':
            keys.a.down=true
            blueLastKey='A'
            blue.sword.swordSide.x=50;
            break;
        case 'W':
            blue.velocity.y=-14
            break;
        case 'S':
            blue.attack();
            break;
    }
}
//čas vypršel
if((blue.health>0)&&(timer<=0)&&(red.health>0)){
    switch(event.key){
        //klávesy modrého
        case 'd':
            keys.d.down=true
            blueLastKey='d'
            blue.sword.swordSide.x=-76;
            break;
        case 'a':
            keys.a.down=true
            blueLastKey='a'
            blue.sword.swordSide.x=50;
            break;
        case 'w':
            blue.velocity.y=-14
            break;
        //klávesy modrého(caps lock)
        case 'D':
            keys.d.down=true
            blueLastKey='D'
            blue.sword.swordSide.x=-76;
            break;
        case 'A':
            keys.a.down=true
            blueLastKey='A'
            blue.sword.swordSide.x=50;
            break;
        case 'W':
            blue.velocity.y=-14
            break;

        //klávesy červeného
        case 'ArrowRight':
            keys.ArrowRight.down=true
            redLastKey='ArrowRight'
            red.sword.swordSide.x=-76;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.down=true
            redLastKey='ArrowLeft'
            red.sword.swordSide.x=50;
            break;
        case 'ArrowUp':
            red.velocity.y=-14
            break;
    }
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

        case 'D':
            keys.d.down=false
            break;
        case 'A':
            keys.a.down=false
            break;

        case 'ArrowRight':
            keys.ArrowRight.down=false
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.down=false
            break;
    }
})