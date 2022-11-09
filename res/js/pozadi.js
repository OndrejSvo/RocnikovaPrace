export class Background {
    constructor(){
        this.img = new Image();
        this.path = "./res/img/basic-ui/background.png";
        this.img.src = this.path;
    }

    draw(ctx, canvas) {
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);

    }
}
