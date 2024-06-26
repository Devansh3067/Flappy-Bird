let pipe = document.querySelector(".pipe");
let hole = document.querySelector(".hole");
let bird = document.querySelector(".bird");
let game_over = document.querySelector(".game-over");
let restart_btn = document.querySelector(".restart-btn");
let score = document.querySelector(".score");
let highestScore = document.querySelector("#highestScore");
let animation = document.querySelector(".animate-article");

let gameFlag = false;

let bgm = new Audio("audio/a_bgm.mp3");
bgm.play();
bgm.loop = true;
let die = new Audio("audio/a_die.mp3");
let jump_audio = new Audio("audio/a_jump.mp3");
let point = new Audio("audio/a_point.mp3");

let scoreCount = 0;
let highestScoreCount = parseInt(localStorage.getItem('highestScore')) || 0;
highestScore.innerHTML = "Highest Score : " + highestScoreCount;

let jumping = false;

let isGameOver = false;
// console.log(parseInt(localStorage.getItem('highestScore')));

document.addEventListener("click", (event) => {
    if (pipe.classList.contains("animate-article") && !pipe.classList.contains("paused-animation")) {
        jump();
    }
});
document.addEventListener("keydown", (event) => {
    // console.log(event.keyCode);
    if ((event.keyCode == 38 || event.keyCode == 32) && pipe.classList.contains("animate-article") && !pipe.classList.contains("paused-animation")) {
        jump();
    }
});

hole.addEventListener("animationiteration", () => {
    scoreCount++;
    if (scoreCount > highestScoreCount) {
        highestScoreCount = scoreCount;
        localStorage.setItem('highestScore', highestScoreCount);
        // console.log(highestScoreCount);
    }

    scoreUpdate(scoreCount, highestScoreCount);
    var randomN = ((Math.random() * 350) + 10);
    hole.style.top = randomN + "px";
})

const handleDifficulty = (scoreC) => {
    if (scoreC > 1 && scoreC <= 15 && parseInt(window.getComputedStyle(hole).getPropertyValue("height")) >= 150) {
        hole.style.height = parseInt(window.getComputedStyle(hole).getPropertyValue("height")) - 2 + "px";
        // console.log(parseInt(window.getComputedStyle(hole).getPropertyValue("height")));
    }
    if (scoreC > 15 && parseInt(window.getComputedStyle(hole).getPropertyValue("height")) >= 150) {
        hole.style.height = parseInt(window.getComputedStyle(hole).getPropertyValue("height")) - 10 + "px";
        animation.style.animationDuration = parseInt(window.getComputedStyle(animation).getPropertyValue("animationDuration")) - 0.05 + 's';
        // console.log(parseInt(window.getComputedStyle(hole).getPropertyValue("height")));
    }
}

function scoreUpdate(scoreCount, highestScoreCount) {
    point.play();
    score.innerHTML = "Your Score : " + scoreCount;
    highestScore.innerHTML = "Highest Score : " + highestScoreCount;
    handleDifficulty(scoreCount);
}

let jumping_interval = setInterval(() => {
    if (!(jumping)) {
        gravity();
    }
}, 10);

function gravity() {
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    bird.style.transform = "rotate(45deg)";
    bird.style.top = birdTop + 3 + "px";
}

function jump() {
    jump_audio.play();
    bird.style.transform = "rotate(-30deg)";
    bird.classList.add("bird_change");
    setTimeout(() => {
        bird.classList.remove("bird_change");
    }, 90)
    jumping = true;
    let jumpCount = 0;
    var jumpInterval = setInterval(function () {
        let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
        if (birdTop > 1) {
            bird.style.top = birdTop - 5 + "px";
        }
        if (jumpCount > 20) {
            clearInterval(jumpInterval);
            jumping = false;
            jumpCount = 0;
        }
        jumpCount++;
    }, 10);
}

setInterval(checkDeath, 1);

function checkDeath() {
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    let pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
    let holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));

    if ((birdTop > 510) || ((pipeLeft < 70) && (pipeLeft > -10) && ((birdTop < holeTop - 10) || (birdTop > holeTop + parseInt(window.getComputedStyle(hole).getPropertyValue("height")) - 40)))) {
        if (!(gameFlag)) {
            gameOver();
        }
    }
}

function gameOver() {
    bgm.pause();
    bgm.currentTime = 0;
    bird.classList.add("bird_die");
    gameFlag = true;
    die.play();
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
    clearInterval(jumping_interval);
    bird.style.top = birdTop + "px";
    pipe.style.left = pipeLeft + "px";
    hole.style.left = pipeLeft + "px";
    pipe.classList.remove("animate-article");
    hole.classList.remove("animate-article");
    game_over.style.visibility = "visible";
    restart_btn.style.visibility = "visible";
    isGameOver = true;
}

const restartFunction = () => {
    isGameOver = false;
    hole.style.height = 200 + "px";
    animation.style.animationDuration = 2 + 's';
    bgm.play();
    bgm.loop = true;
    bird.classList.remove("bird_die");
    hole.style.top = 10 + "px";
    bird.style.top = 30 + "px";
    game_over.style.visibility = "hidden";
    restart_btn.style.visibility = "hidden";
    pipe.classList.add("animate-article");
    hole.classList.add("animate-article");
    jumping_interval = setInterval(() => {
        if (!(jumping)) {
            gravity();
        }
    }, 10);
    setInterval(checkDeath, 1);
    scoreCount = 0;
    scoreUpdate(scoreCount, highestScoreCount);
    gameFlag = false;
}

document.addEventListener("keydown", (event) => {
    // console.log(event.keyCode);
    if ((event.keyCode == 13) || (event.keyCode == 32 && isGameOver)) {
        restartFunction();
    }
})

restart_btn.addEventListener("click", restartFunction);

let isPaused = false;

function pause() {
    if (!(isPaused)) {
        bgm.pause();
        clearInterval(jumping_interval);
        birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
        pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
        bird.style.top = birdTop + "px";
        pipe.style.left = pipeLeft + "px";
        hole.style.left = pipeLeft + "px";
        pipe.classList.add("paused-animation");
        hole.classList.add("paused-animation");
        isPaused = true;
    }
    else {
        bgm.play();
        bgm.loop = true;
        pipe.classList.remove("paused-animation");
        hole.classList.remove("paused-animation");
        jumping_interval = setInterval(() => {
            if (!(jumping)) {
                gravity();
            }
        }, 10);
        isPaused = false;
    }
}

document.addEventListener("keydown", (event) => {
    if (event.keyCode == 75 && !isGameOver) {
        pause();
    }
})