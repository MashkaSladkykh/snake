const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreText = document.querySelector('.score');
const resetBtn = document.querySelector('.reset');
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const boardColor = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "green";
const obstacleColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];
const obstacles = [];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    createObstacles();
    drawObstacles();
    nextTick();
};
function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            drawObstacles();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 150)
    } 
    else{
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function randomEl(min,max){
    const randomNum = Math.round((Math.random()*(max-min)+min) / unitSize) * unitSize;
    return randomNum;
}
function createFood(){
    foodX = randomEl(0, gameWidth - unitSize);
    foodY = randomEl(0, gameWidth - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);
    //feed
    if(snake[0].x == foodX && snake[0].y == foodY) {
        score = score + 1;
        scoreText.textContent = score;
        createFood();
        createObstacles();
        drawObstacles();
    }
    else{
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(el =>{
        ctx.fillRect(el.x, el.y, unitSize, unitSize);
        ctx.strokeRect(el.x, el.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const keyPressed = event.keyCode;
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == left && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == up && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == right && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == down && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;    
    }
};
function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            snake[0].x = gameWidth
            break;
        case (snake[0].x >= gameWidth):
            snake[0].x = 0
            break;
        case (snake[0].y < 0):
            snake[0].y = gameHeight
            break;
        case (snake[0].y >= gameHeight):
            snake[0].y = 0
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
    for(let i = 1; i < obstacles.length; i++){
        if(snake[0].x == obstacles[i].x && snake[0].y == obstacles[i].y){
            running = false;
        }
    }

};
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
    running = false;
};
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};
function createObstacles(){
    obstacles.length = Math.floor(Math.random() * 4);
    for(let i=0; i< obstacles.length; i++){
        obstacles[i] = {x: randomEl(0, gameWidth - unitSize),
                        y: randomEl(0, gameWidth - unitSize)}
    }
};
function drawObstacles(){
    ctx.fillStyle = obstacleColor;
    ctx.strokeStyle = snakeBorder;
    obstacles.forEach((el)=>{
        ctx.fillRect(el.x, el.y, unitSize, unitSize);
        ctx.strokeRect(el.x, el.y, unitSize, unitSize);
    })  
};