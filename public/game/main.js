// * Размеры
const box = 30;
const additWidth = 130;
const additHeight = 10;
const W = 510;
const H = 840;
const startY = 90;
const startX = 150;
const lineWidth = 1.5;
// * Звук при успехе
const audio = new Audio("https://zvukipro.com/uploads/files/2019-03/1553774320_aa4b773936bb0cb.mp3")
audio.volume = 0.7;

// * Цвета
let textColor = 'black';
let bgcColor = 'white';
let lineColor = 'black'

let fps = 60;

let setEventGameplay;
let tetris;
let secondField;

function setup() {
    // * 1st player
    const canvas = document.querySelector('#game_canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = W + additWidth;
    canvas.height = H + additHeight;
    canvas.style.width = W + additWidth + 'px';
    canvas.style.height = H + additHeight + 'px';

    // * 2nd player
    const canvas2 = document.querySelector('#game_canvas2');
    const ctx2 = canvas2.getContext('2d');
    canvas2.width = W + additWidth;
    canvas2.height = H + additHeight;
    canvas2.style.width = W + additWidth + 'px';
    canvas2.style.height = H + additHeight + 'px';

    const field = new Field(ctx, box, undefined, bgcColor, lineColor, startX, startY, W, H, lineWidth, additWidth);
    const shape = new Shape(ctx, randomShape(), box, startX, startY, W, H);

    secondField = new SecondField(ctx2, box, undefined, bgcColor, lineColor, startX, startY, W, H, lineWidth, additWidth);

    tetris = new Tetris(shape, field, fps);
    startGame(tetris);

    setEventGameplay = (e) => setEventListenersGameplay(e, tetris);
    document.addEventListener('keydown', setEventGameplay);
    document.addEventListener('keydown', (e) => setEventListenersPause(e, tetris));
}

function randomShape() {
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

function startGame(tetris) {
    tetris.startMoveLoop();
    tetris.startRenderLoop();
}

window.addEventListener("keydown", function (e) {
    if (e.code == "ArrowUp" || e.code == "ArrowDown" || e.code == "Space") {
        e.preventDefault();
    }
}, false);

function setEventListenersGameplay(e, tetris) {
    tetris.moveListener(e);
    if (e.code == "ControlLeft" || e.code == "ControlRight") {
        tetris.addPocketShape();
    }
}

function setEventListenersPause(e, tetris) {
    if (e.code == "KeyP") {
        if (tetris.pause()) {
            document.removeEventListener('keydown', setEventGameplay);
        } else {
            document.addEventListener('keydown', setEventGameplay);
        }
    }
}


// * Меню сверху
function menuEventListeners() {
    const pauseBlock = document.querySelector('#pause_container');
    pauseBlock.addEventListener('click', () => {
        if (tetris.pause()) {
            document.removeEventListener('keydown', setEventGameplay);
            document.querySelector('#pause_icon').setAttribute('src', 'app/play-button.png');
        } else {
            document.addEventListener('keydown', setEventGameplay);
            document.querySelector('#pause_icon').setAttribute('src', 'app/pause.png');
        }
    })
}



window.onload = () => {
    const game = new Game('#goBack', '.condition');
    setup();
    menuEventListeners();

    game.getRequestIsUserLoggedIn();

    game.setEventListeners();

    game.getRequestReadyForGame();

    game.startGetGameLoop(secondField, 500);
    game.startSendDataGameLoop(tetris, 500);
}