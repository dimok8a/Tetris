class Field {
    constructor(ctx, sizeOfBox = 30, matrix, bgcColor = 'white', color = 'black', startX = 0, startY = 0, width = 600, height = 900, lineWidth = 2, additWidth = 300, additHeight = 10) {
        this.ctx = ctx;
        this.sizeOfBox = sizeOfBox;
        this.bgcColor = bgcColor;
        this.color = color;
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
        this.lineWidth = lineWidth;
        this.additWidth = additWidth;
        this.additHeight = additHeight;
    }

    drawSquares() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        for (let i = this.startX; i <= this.width; i += this.sizeOfBox) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.startY);
            this.ctx.lineTo(i, this.height);
            this.ctx.stroke();
        }
        for (let i = this.startY; i <= this.height; i += this.sizeOfBox) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.startX, i);
            this.ctx.lineTo(this.width, i);
            this.ctx.stroke();
        }
    }

    fillSquare(x, y, size, color) {
        this.ctx.beginPath()
        this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]})`;
        this.ctx.fillRect(x, y, size, size);
        this.ctx.stroke();
    }

    printText(text = "Sample text", x = 0, y = 0, size = 20, color = "black") {
        this.ctx.fillStyle = color;
        this.ctx.font = `italic ${size}pt Roboto`;
        this.ctx.fillText(text, x, y, this.width / 2);
    }

    clear() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.bgcColor;
        this.ctx.fillRect(0, 0, this.width + this.additWidth, this.height + this.additHeight);
        this.ctx.stroke();
    }




}