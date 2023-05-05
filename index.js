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
const bonusColor = 'purple';
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let bonusX;
let bonusY;
let speed = 150;
let score = 0;
let snake = [
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];
let reverse = false;
const obstacles = [];
const randomIndex =(min, max) => Math.round(Math.random() * (max - min) + min);
let lastInputTime = 0;
const inputDelay = 100;
const isFilled = (x,y) => isPixelFilled(ctx, x, y, boardColor);

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function isPixelFilled(context, x, y, backgroundColor) {
    const pixelData = context.getImageData(x, y, 1, 1).data;
    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];
    const alpha = pixelData[3];
    const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    return color !== backgroundColor;
  }

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    createBonus();
    drawBonus();
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
            drawBonus();
            checkGameOver();
            nextTick();
        }, speed)
        
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
    let tempX = randomEl(0, gameWidth - unitSize);
    let tempY = randomEl(0, gameWidth - unitSize);
    isFilled(tempX, tempY) ? ( foodX = tempX, foodY = tempY) : null;
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    snake.unshift(head);

    const index = randomIndex(0,2);
    //feed
    if(snake[0].x == foodX && snake[0].y == foodY) {
        score = score + 1;
        scoreText.textContent = score;
        createFood();
    }  else if(snake[0].x == bonusX && snake[0].y == bonusY){
        if(index === 0) {
            snake.pop();
            speed /= 2; // збільшуємо удвічі
            setTimeout(() => {
                speed = 150; //повертаємо нормальну швидкість
            }, 20000);
        }
        if(index === 1) {
           // Збільшуємо довжину змійки на 5 блоків
           for(let i = 0; i < 5; i++) {
            const newBlock = {x: snake[snake.length - 1].x, y: snake[snake.length - 1].y};
            snake.push(newBlock);
            }
        }
        if(index===2){
            snake.pop();
            reverse = true;
            setTimeout(()=>reverse = false, 10000)
        }
        bonusX = -bonusX;
        bonusY = -bonusY;
       setTimeout(()=>createBonus(),7000)
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
    const currentTime = Date.now();

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if (currentTime - lastInputTime < inputDelay) {
        return; // Ігноруємо ввод, якщо затримка ще не пройшла
    }

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
    if(reverse){
        switch(reverse){
            case(keyPressed == left && !goingLeft && !goingRight):
                xVelocity = unitSize;
                yVelocity = 0;
                break;
            case(keyPressed == up && !goingDown && !goingUp):
                xVelocity = 0;
                yVelocity = unitSize;
                break;
            case(keyPressed == right && !goingRight && !goingLeft):
                xVelocity = -unitSize;
                yVelocity = 0;
                break;
            case(keyPressed == down && !goingUp && !goingDown):
                xVelocity = 0;
                yVelocity = -unitSize;
                break;    
        }
    }
    lastInputTime = currentTime; 
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
    for(let i = 0; i < obstacles.length; i++){
        const x = obstacles[i].x;
        const y = obstacles[i].y;
        const w = obstacles[i].w;
        const h = obstacles[i].h;
        if(x <= snake[0].x && snake[0].x < (x + w)
            && y <= snake[0].y && snake[0].y < (y + h)){
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
    obstacles.length = 4;
    let tempX = randomEl(0, gameWidth - unitSize);
    let tempY = randomEl(0, gameWidth - unitSize);

    for(let i=0; i< obstacles.length; i++){  
        isFilled(tempX, tempY) 
        ? 
            obstacles[i] = {x: randomEl(0, gameWidth - unitSize),
                y: randomEl(0, gameWidth - unitSize),
                w: randomIndex(1, 3) * unitSize,
                h: randomIndex(1,3) * unitSize, } 
        : null;
    }
};
function drawObstacles(){
    ctx.fillStyle = obstacleColor;
    ctx.strokeStyle = snakeBorder;
    obstacles.forEach((el)=>{
        ctx.fillRect(el.x, el.y, el.w, el.h);
        ctx.strokeRect(el.x, el.y, el.w, el.h);
    });
};


function createBonus(){
    let tempX = randomEl(0, gameWidth - unitSize);
    let tempY = randomEl(0, gameWidth - unitSize);
    isFilled(tempX, tempY) ? ( bonusX = tempX, bonusY = tempY) : null;
};

function drawBonus(){
    ctx.fillStyle = bonusColor;
    ctx.fillRect(bonusX, bonusY, unitSize, unitSize);
};


// 3.1 збільшення швидкості в 2 рази на 20 секунд
// 3.2 Збільшення змійки на 5 пунктів
// 3.3 зміна реверсивний контроль змійкою на 10 секунд