let canvas,ctx;
document.addEventListener('DOMContentLoaded',(ev)=>{
    canvas=document.getElementById('canvas');
    ctx=canvas.getContext('2d');
    canvas.width=1280;
    canvas.height=720;

    let imgObj = new Image()

    imgObj.onload=function(){
        let w=canvas.width;
        let nw=imgObj.naturalWidth;
        let nh=imgObj.naturalHeight;
        let aspect=nw/nh;
        let h= canvas.width/aspect;
        canvas.height=h;
        ctx.drawImage(imgObj,0,0,w,h);
    }
    imgObj.src="./res/img/pozadi2.png";
})