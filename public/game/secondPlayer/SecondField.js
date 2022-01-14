class SecondField {
    constructor(ctx, sizeOfBox = 30, matrix, bgcColor = 'white', color = 'black', startX = 0, startY = 0, width = 600, height = 900, lineWidth = 2, additWidth = 300, additHeight = 10) {
        this.field = new Field(ctx, sizeOfBox, matrix, bgcColor, color, startX, startY, width, height, lineWidth, additWidth, additHeight);
        this.field.drawSquares();
        this.printText();
    }
    printText(score) {
        this.field.printText(`Счет:${score}`, (this.field.width - this.field.startX) / 2 + this.field.startX - this.field.sizeOfBox, this.field.sizeOfBox * 2, this.field.sizeOfBox / 1.5, this.textColor); // Выводим счет
        this.field.printText('Next  ', this.field.sizeOfBox, this.field.sizeOfBox * 4, this.field.sizeOfBox / 1.5, this.field.sizeOfBox, this.textColor); // Выводим следующую фигуру
        this.field.printText('Карман', this.field.width + this.field.sizeOfBox, this.field.sizeOfBox * 4, this.field.sizeOfBox / 1.5, this.textColor);
    }
    returnShape(rnd) {
        switch (rnd) {
            case 0:
                return "O"
            case 1:
                return "I"
            case 2:
                return "T"
            case 3:
                return "J"
            case 4:
                return "L"
            case 5:
                return "S"
            case 6:
                return "Z"
        }
    }

    updateState(data) {
        this.field.clear();

        const dataObj = eval('(' + data + ')');
        dataObj.matrix.forEach(arr => {
            this.field.fillSquare(this.field.startX + arr[1] * this.field.sizeOfBox, this.field.startY + arr[0] * this.field.sizeOfBox, this.field.sizeOfBox, [arr[2], arr[3], arr[4]]);
        });

        if (dataObj.next != 7) {
            const nextType = this.returnShape(dataObj.next);
            if (!this.nextShape) {
                this.nextShape = new Shape(this.field.ctx, nextType, this.field.sizeOfBox, this.field.startX, this.field.startY, this.field.width, this.field.height, this.field.matrix);
            }
            if (nextType == "O") {
                this.nextShape.startX = -this.field.sizeOfBox * 13;
                this.nextShape.startY = this.field.startY + this.field.sizeOfBox * 2;
                this.nextShape.changeType(nextType, this.field);
                this.nextShape.drawWithLines(this.field.lineWidth, this.field.color);
            } else {
                this.nextShape.startX = -this.field.sizeOfBox * 12;
                this.nextShape.startY = this.field.startY + this.field.sizeOfBox * 2;
                this.nextShape.changeType(nextType, this.field);
                this.nextShape.drawWithLines(this.field.lineWidth, this.field.color);
            }
        }
        if (dataObj.pocket != 7) {
            const pocketType = this.returnShape(dataObj.pocket);
            if (!this.pocketShape) {
                this.pocketShape = new Shape(this.field.ctx, pocketType, this.field.sizeOfBox, this.field.startX, this.field.startY, this.field.width, this.field.height, this.field.matrix);
            }
            if (pocketType == "O") {
                this.pocketShape.startX = this.field.width + this.field.sizeOfBox * 3;
                this.pocketShape.startY = this.field.startY + this.field.sizeOfBox * 2.5;
                this.pocketShape.changeType(pocketType, this.field);
                this.pocketShape.drawWithLines(this.field.lineWidth, this.field.color);
            } else {
                this.pocketShape.startX = this.field.width + this.field.sizeOfBox * 5;
                this.pocketShape.startY = this.field.startY + this.field.sizeOfBox * 2.5;
                this.pocketShape.changeType(pocketType, this.field);
                this.pocketShape.drawWithLines(this.field.lineWidth, this.field.color);
            }
        }

        this.printText(dataObj.score);

        this.field.drawSquares();
    }
}