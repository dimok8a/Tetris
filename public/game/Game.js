class Game {
    constructor(leftGameBtn, conditionContainer, getGameLoopTime = 1000) {
        this.leftGameBtn = document.querySelector(leftGameBtn);
        this.conditionContainer = document.querySelector(conditionContainer);
        this.getGameLoopTime = getGameLoopTime;

    }

    async sendRequestLeftGame() {
        const answer = await fetch(`http://tetris/api/?method=leftGame&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async getRequestLeftGame() {
        const result = await this.sendRequestLeftGame();
        if (result) {
            window.open('http://tetris/public/lobby', '_self');
        } else {
            this.conditionContainer.innerText = 'Что-то пошло не так :(';
            this.conditionContainer.style.color = 'red';
            setTimeout(() => this.conditionContainer.innerText = "", 3000);
        }
    }

    async sendRequestGetGame() {
        const answer = await fetch(`http://tetris/api/?method=getDataGame&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return jsonRes['data'];
        }
        return false;
    }

    startGetGameLoop(secondField, loop = 1000) {
        this.getGameLoop = setInterval(() => {
            const result = this.sendRequestGetGame();
            result.then(val => {
                if (!val) {
                    this.conditionContainer.innerText = 'Что-то пошло не так :(';
                    this.conditionContainer.style.color = 'red';
                    clearInterval(this.getGameLoop);
                    setTimeout(() => {
                        this.conditionContainer.innerText = ""
                        window.open('http://tetris/public/lobby', '_self');
                    }, 3000);
                } else {
                    if (val.data != null) {
                        secondField.updateState(val.data);
                    }
                    if (val.status == "starting") {
                        this.conditionContainer.innerText = 'Ждем второго игрока';
                    } else if (val.status == "playing") {
                        this.conditionContainer.innerText = 'Игра продолжается';
                    } else {
                        this.conditionContainer.innerText = 'Игра остановлена';
                    }
                    this.conditionContainer.style.color = 'green';
                }
            });
        }, loop);
    }

    async sendRequsetSendDataGame(query) {
        const answer = await fetch(`http://tetris/api/?method=sendDataGame&token=${localStorage.getItem('token')}&data=${query}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    whatNumShape(shapeType) {
        switch (shapeType) {
            case "O":
                return 0
            case "I":
                return 1
            case "T":
                return 2
            case "J":
                return 3
            case "L":
                return 4
            case "S":
                return 5
            case "Z":
                return 6
            default:
                return 7
        }
    }

    startSendDataGameLoop(tetris, loopTime) {
        this.getGameLoop = setInterval(() => {
            const matrixTetris = tetris.updateData();
            let pocket = 7;
            if (tetris.pocketShape != undefined) {
                pocket = this.whatNumShape(tetris.pocketShape.type);
            }
            const dataObj = {
                matrix: matrixTetris,
                score: tetris.score,
                next: this.whatNumShape(tetris.nextShape.type),
                pocket
            }
            const jsonData = JSON.stringify(dataObj);
            const result = this.sendRequsetSendDataGame(jsonData);
            // result.then(val => {
            //     if (!val) {
            //         console.log('Запрос не передан');
            //     } else {
            //         console.log('Запрос передан');
            //     }
            // });
        }, loopTime);
    }


    async sendRequestIsUserLoggedIn() {
        const answer = await fetch(`http://tetris/api/?method=isUserLoggedIn&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async getRequestIsUserLoggedIn() {
        const result = await this.sendRequestIsUserLoggedIn();
        if (!result) {
            window.open('http://tetris', '_self');
        }
    }

    async sendRequestReadyForGame() {
        const answer = await fetch(`http://tetris/api/?method=readyForGame&token=${localStorage.getItem('token')}`);
        const result = await answer.text();
        const jsonRes = JSON.parse(result);
        if (jsonRes.result == 'ok') {
            return true;
        }
        return false;
    }

    async getRequestReadyForGame() {
        await this.sendRequestReadyForGame();
    }

    setEventListeners() {
        this.leftGameBtn.addEventListener('click', () => {
            this.getRequestLeftGame();
        })
    }
}