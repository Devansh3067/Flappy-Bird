let pipe = document.querySelector(".pipe");
let hole = document.querySelector(".hole");
let bird = document.querySelector(".bird");
let game_over = document.querySelector(".game-over");
let restart_btn = document.querySelector(".restart-btn");
let score = document.querySelector(".score");

let gameFlag = false;

let bgm = new Audio("audio/a_bgm.mp3");
bgm.play();
bgm.loop = true;
let die = new Audio("audio/a_die.mp3");
let jump_audio = new Audio("audio/a_jump.mp3");
let point = new Audio("audio/a_point.mp3");

let scoreCount = 0;

let jumping = false;

document.addEventListener("click",()=>{
    if(pipe.classList.contains("animate-article")){
        jump();
    }
});
document.addEventListener("keydown",(event)=>{
    if((event.keyCode == 38 || event.keyCode == 32)&& pipe.classList.contains("animate-article")){
        jump();
    }
});

hole.addEventListener("animationiteration",()=>{
    scoreCount++;
    scoreUpdate(scoreCount);
    var randomN = ((Math.random()*400)+10);
    hole.style.top = randomN + "px";
})

function scoreUpdate(scoreC){
    point.play();
    score.innerHTML = "Your Score : "+ scoreC;
}

let jumping_interval = setInterval(()=>{
    if(!(jumping)){
        gravity();
    }
},10);

function gravity(){
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    bird.style.rotate = 45+"deg";
    bird.style.top = birdTop + 3 + "px";
}

function jump(){
    jump_audio.play();
    bird.style.rotate = -30 +"deg";
    bird.classList.add("bird_change");
    setTimeout(()=>{
        bird.classList.remove("bird_change");
    },90)
    jumping = true;
    let jumpCount = 0;
    var jumpInterval = setInterval(function(){
        let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
        if(birdTop > 10){
            bird.style.top = birdTop - 5 + "px";
        }
        if (jumpCount > 20){
            clearInterval(jumpInterval);
            jumping = false;
            jumpCount = 0;
        }
        jumpCount++;
    },10);
}

setInterval(checkDeath,1);

function checkDeath(){
    birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
    let pipeLeft = parseInt(window.getComputedStyle(pipe).getPropertyValue("left"));
    let holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));

    if((birdTop > 520)||((pipeLeft<70)&&(pipeLeft>-10)&&((birdTop<holeTop)||(birdTop>holeTop+90)))){
        if(!(gameFlag)){
            gameOver();
        }
    }
}

function gameOver(){
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
}

restart_btn.addEventListener("click", ()=>{
    bgm.play();
    bgm.loop = true;
    bird.classList.remove("bird_die");
    hole.style.top = 10 + "px";
    bird.style.top = 30 + "px";
    game_over.style.visibility = "hidden";
    restart_btn.style.visibility = "hidden";
    pipe.classList.add("animate-article");
    hole.classList.add("animate-article");
    jumping_interval = setInterval(()=>{
        if(!(jumping)){
            gravity();
        }
    },10);
    setInterval(checkDeath,1);
    scoreCount = 0;
    scoreUpdate(scoreCount);
    gameFlag = false;
})