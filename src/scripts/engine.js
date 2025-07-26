const gameOverSound = new Audio("./src/audios/gameover.mp3");
gameOverSound.preload = "auto";

const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        livesDisplay: document.querySelector('.menu-live h2'),
        panel: document.querySelector('.panel'),
    },
    values: {
        timerId: null,
        countdownTimerId: null,
        gameVelocity: 1000,
        hitposition: null,
        result: 0,
        currentTime: 10,
        lives: 3,
    },
    actions: {
        countDown: () => {
            state.values.currentTime--;
            state.view.timeLeft.textContent = state.values.currentTime;
        }
    }
};

function resetGame() {
    clearInterval(state.values.countdownTimerId);
    clearInterval(state.values.timerId);
    state.values.currentTime = 10;
    state.values.result = 0;
    state.values.hitposition = null;
    state.values.lives = 3;
    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.livesDisplay.textContent = "x" + state.values.lives;
}

function countDown() {
    state.actions.countDown();

    if (state.values.currentTime <= 0 || state.values.lives <= 0) {
        clearInterval(state.values.countdownTimerId);
        clearInterval(state.values.timerId);
        gameOverSound.play();
        alert("GAME OVER!! O seu resultado foi " + state.values.result);
        initialize();
    }
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove('enemy');
    });
    const randomNumber = Math.floor(Math.random() * 9);
    const randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add('enemy');
    state.values.hitposition = randomSquare.id;
}

function moveEnemy() {
    state.values.timerId = setInterval(() => {
        randomSquare();
    }, state.values.gameVelocity);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitposition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitposition = null;
            } else {
                loseLife();
            }
        });
    });

    state.view.panel.addEventListener("mousedown", (event) => {
        if (!event.target.classList.contains('square')) {
            loseLife();
        }
    });
}

function loseLife() {
    if (state.values.lives > 0) {
        state.values.lives--;
        state.view.livesDisplay.textContent = "x" + state.values.lives;
    }
}

function initialize() {
    resetGame();
    addListenerHitBox();
    moveEnemy();
    state.view.timeLeft.textContent = state.values.currentTime;
    state.values.countdownTimerId = setInterval(countDown, 1000);
}

initialize();
