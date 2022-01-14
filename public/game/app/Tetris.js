class Tetris {
    constructor(shape, field, fps = 60, score = 0, speed = 500, textColor = 'black',
        matrix = (new Array((field.height - field.startY) / field.sizeOfBox).fill(0).map(() => {
            return new Array((field.width - field.startX) / field.sizeOfBox).fill(0)
        })),
        emptyLines = [], arrShapes = [],
        audio = new Audio("https://zvukipro.com/uploads/files/2019-03/1553774320_aa4b773936bb0cb.mp3"),
        audioVolume = 0.7, shadowColor = "#838996AC") {
        this.shape = shape;
        this.field = field;
        this.fps = fps;
        this.score = score;
        this.speed = speed;
        this.textColor = textColor;
        this.matrix = matrix;
        this.emptyLines = emptyLines;
        this.arrShapes = arrShapes;
        this.generateNewType(shape.type);
        this.nextShape = new Shape(shape.ctx, this.newType, shape.boxSize, shape.startX, shape.startY, shape.fieldWidth, shape.fieldHeight, shape.matrix);
        this.audio = audio;
        this.audioVolume = audioVolume;
        this.shadowColor = shadowColor;

        this.renderLoop = undefined;
        this.moveLoop = undefined;
        this.state = true;
        this.canAddPocket = true;
        this.pocketShape = undefined;

        this.data = (new Array((field.height - field.startY) / field.sizeOfBox).fill('none').map(() => {
            return new Array((field.width - field.startX) / field.sizeOfBox).fill('none');
        }));

        this.isPause = false;
    }

    render() {
        this.field.clear(); // Очищаем поле
        this.shape.draw(); // Рисуем фигуру
    }

    updateData() {
        let data = [];
        data = this.shape.updateDataMatrix(data);
        this.arrShapes.forEach(val => {
            data = val.updateDataMatrix(data);
        });
        return data;
    }

    printText() {
        this.field.printText(`Счет: ${this.score}`, (this.field.width - this.field.startX) / 2 + this.field.startX - this.field.sizeOfBox, this.field.sizeOfBox * 2, this.field.sizeOfBox / 1.5, this.textColor); // Выводим счет
        this.field.printText('Next  ', this.field.sizeOfBox * 1.5, this.field.sizeOfBox * 4, this.field.sizeOfBox / 1.5, this.field.sizeOfBox, this.textColor); // Выводим следующую фигуру
        this.field.printText('Карман', this.field.width + this.field.sizeOfBox, this.field.sizeOfBox * 4, this.field.sizeOfBox / 1.5, this.textColor);
        // this.field.printText('Управление: ', this.field.width + this.field.sizeOfBox, this.field.height - 4 * this.field.sizeOfBox, this.field.sizeOfBox / 1.5, this.textColor);
        // this.field.printText('↑', this.field.width + this.field.sizeOfBox * 2, this.field.height - 3 * this.field.sizeOfBox, this.field.sizeOfBox / 1.5, this.textColor);
        // this.field.printText('← ↓ → ', this.field.width + this.field.sizeOfBox, this.field.height - 2 * this.field.sizeOfBox, 20, this.textColor);
        // this.field.printText('ctrl - добавить в карман', this.field.width + 20, this.field.height - this.field.sizeOfBox, 20, this.textColor);
    }

    startRenderLoop() {
        this.renderLoop = setInterval(() => {
            this.render();
            this.shape.drawShadow(this.shadowColor);
            this.drawNextType();
            this.drawPocketShape();
            this.printText();
            this.printLyingShapes();
            this.field.drawSquares();
        }, 1000 / this.fps);
    }

    moveShapeDown() {
        this.state = this.shape.moveDown();
        this.checkGameState();
        this.checkLyingShapes();
        this.changeScore();
        this.shape.matrix = this.matrix;
    }
    startMoveLoop() {
        this.moveLoop = setInterval(() => {
            this.moveShapeDown();
        }, this.speed);
    }

    stopRenderLoop() {
        clearInterval(this.renderLoop);
    }

    stopMoveLoop() {
        clearInterval(this.moveLoop);
    }

    // Проверяет состояние игры после каждого сдвига фигуры вниз
    checkGameState() {
        if (!this.state) {
            this.complementMatrix(this.shape); // Дополняем матрицу упавшей фигурой
            this.findEmptyLines(); // Ищем заполненные линии в матрице
            let shape = new Shape(this.shape.ctx, this.shape.type, this.shape.boxSize, this.shape.startX, this.shape.startY, this.shape.fieldWidth, this.shape.fieldHeight, this.shape.matrix);
            shape.coords = this.shape.coords;
            shape.color = this.shape.color;
            this.arrShapes.push(shape);
            this.shape.changeType(this.newType, this.field);
            this.generateNewType();
            this.canAddPocket = true;
        }
    }

    // Генерирует следующую фигуру
    generateNewType(oldType = undefined) {
        let prevShape;
        if (oldType != undefined) {
            prevShape = oldType;
        } else {
            prevShape = this.shape.type;
        }
        let newShape = this.randomShape();
        while (newShape == prevShape) {
            newShape = this.randomShape();
        }
        this.newType = newShape;
        if (this.nextShape) {
            this.nextShape.type = newShape;
        }
    }

    // Выводим следующую фигуру
    drawNextType() {
        if (this.newType != undefined) {
            if (this.newType == "O") {
                this.nextShape.startX = -this.field.sizeOfBox * 13;
                this.nextShape.startY = this.field.startY + this.field.sizeOfBox * 2;
                this.nextShape.changeType(this.nextShape.type, this.field);
                this.nextShape.drawWithLines(this.field.lineWidth, this.field.color);
                // let newShape = new Shape(this.shape.ctx, this.newType, this.field.sizeOfBox, -430, 150, this.field.width, this.field.height);
                // newShape.drawWithLines(this.field.lineWidth, this.field.color);
            } else {
                this.nextShape.startX = -this.field.sizeOfBox * 12;
                this.nextShape.startY = this.field.startY + this.field.sizeOfBox * 2;
                this.nextShape.changeType(this.nextShape.type, this.field);
                this.nextShape.drawWithLines(this.field.lineWidth, this.field.color);
            }
        }
    }

    // Генерирует рандомную фигуру
    randomShape() {
        const rnd = Math.floor(Math.random() * (6 + 1));
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

    complementMatrix(shape) { // Дополняет готовую матрицу указанной фигурой (единицами)
        if (this.matrix) {
            for (let i = 0; i < shape.coords['y'].length; i++) {
                if (isNaN(shape.coords['y'][i]) == false && isNaN(shape.coords['x'][i]) == false) {
                    this.matrix[(shape.coords['y'][i] - this.field.startY) / shape.boxSize][(shape.coords['x'][i] - this.field.startX) / shape.boxSize] = 1;
                }
            }
            this.shape.matrix = this.matrix;
        }
    }

    // Находим линии в матрице, которые необходимо удалить
    findEmptyLines() {
        if (this.matrix && this.matrix.length > 1) {
            this.matrix.forEach((val, ind) => {
                if (val.every(elem => elem == 1)) {
                    this.emptyLines.push(ind);
                }
            });
        }
    }

    deleteEmptyLines() { // Удаляет пустые линии матрицы
        let tmpMatrix = this.matrix.map(arr => arr.slice());;
        if (this.emptyLines.length > 0) {
            this.emptyLines.forEach(val => {
                for (let i = val; i > 0; i--) {
                    tmpMatrix[i] = tmpMatrix[i - 1]
                }
            })
        }
        this.matrix = tmpMatrix;
    }
    createEmptyTmpMatrix() { // Создает матрицу с пустыми линиями (нулями)
        let tmpMatrix = this.matrix.map(arr => arr.slice());
        if (this.emptyLines.length > 0) {
            this.emptyLines.forEach(val => {
                tmpMatrix[val] = new Array(this.matrix[0].length).fill(0);
            })
        }
        return tmpMatrix;
    }

    createTmpMatrix(shape) { // Создает матрицу без указанной фигуры
        let tmpMatrix = this.createEmptyTmpMatrix();
        if (tmpMatrix) {
            for (let i = 0; i < shape.coords['x'].length; i++) {
                if (shape.coords['y'][i]) {
                    tmpMatrix[(shape.coords['y'][i] - this.field.startY) / shape.boxSize][(shape.coords['x'][i] - this.field.startX) / shape.boxSize] = 0;
                }
            }
        }
        return tmpMatrix;
    }

    // Изменения упавших фигур
    checkLyingShapes() {
        if (this.arrShapes) {
            this.arrShapes.forEach((sh, ind) => {
                if (this.emptyLines.length > 0) {
                    sh.needToDelete(this.emptyLines); // Смотрим удалилась целая фигура или только часть
                    if (sh.isEmpty()) { // Если целая, то удаляем фигуру из массива
                        this.arrShapes[ind] = undefined;
                    }
                    sh.goDown(this.emptyLines);
                    this.complementMatrix(sh);
                }
            });
            this.arrShapes = this.arrShapes.filter(val => val !== undefined); // Удаляем из массива все undefined фигуры
        }
    }
    // Вывод лежащих фигур
    printLyingShapes() {
        this.arrShapes.forEach((sh) => {
            if (sh !== undefined) { // Если не удалили фигуру из массива, то рисуем ее
                sh.draw();
            }
        })
    }


    changeScore() {
        if (this.emptyLines.length > 0) {
            this.audio.volume = this.audioVolume;
            switch (this.emptyLines.length) {
                case 1:
                    this.score += 100;
                    this.audio.play();
                    break;
                case 2:
                    this.score += 300;
                    this.audio.play();
                    break;
                case 3:
                    this.score += 700;
                    this.audio.play();
                    break;
                case 4:
                    this.score += 1500;
                    this.audio.play();
                    break;
            }
            if (this.speed > 50) {
                this.speed -= this.emptyLines.length * 10;
                this.stopMoveLoop();
                this.startMoveLoop();
            }
            this.deleteEmptyLines();
            this.emptyLines = [];
        }
    }

    moveListener(e) {
        switch (e.code) {
            case "ArrowLeft":
                this.shape.moveLeft();
                break;
            case "ArrowRight":
                this.shape.moveRight();
                break;
            case "ArrowDown":
                this.moveShapeDown();
                this.score += 2;
                break;
            case "ArrowUp":
                this.shape.turnOver();
                break;
            case "Space":
                while (this.state) {
                    this.moveShapeDown();
                    this.score += 2;
                }
                break;
        }
    }

    addPocketShape() {
        if (this.canAddPocket) {
            this.canAddPocket = false;
            if (this.pocketShape == undefined) {
                this.pocketShape = new Shape(this.shape.ctx, this.shape.type, this.shape.boxSize, this.shape.startX, this.shape.startY, this.shape.fieldWidth, this.shape.fieldHeight, this.shape.matrix);
                this.shape.changeType(this.newType, this.field);
                this.generateNewType();
                return;
            }
            const prevType = this.shape.type;
            this.shape.changeType(this.pocketShape.type, this.field);
            this.pocketShape.changeType(prevType, this.field);
        }
    }

    // Выводим фигуру из кармана
    drawPocketShape() {
        if (this.pocketShape != undefined) {
            if (this.pocketShape.type == "O") {
                this.pocketShape.startX = this.field.width + this.field.sizeOfBox * 3;
                this.pocketShape.startY = this.field.startY + this.field.sizeOfBox * 2.5;
                this.pocketShape.changeType(this.pocketShape.type, this.field);
                this.pocketShape.drawWithLines(this.field.lineWidth, this.field.color);
            } else {

                this.pocketShape.startX = this.field.width + this.field.sizeOfBox * 5;
                this.pocketShape.startY = this.field.startY + this.field.sizeOfBox * 2.5;

                this.pocketShape.changeType(this.pocketShape.type, this.field);
                this.pocketShape.drawWithLines(this.field.lineWidth, this.field.color);
            }
        }
    }

    pause() {
        if (!this.isPause) {
            this.stopMoveLoop();
            this.isPause = true;
            return true;
        }
        this.startMoveLoop();
        this.isPause = false;
        return false;
    }
}