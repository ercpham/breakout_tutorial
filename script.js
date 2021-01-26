// Capture canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Canvas constants
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 650;

// Ball constants
const BLUE_COLOR = "#0095DD";
const GREEN_COLOR = "#B8F0B7";
const RED_COLOR = "#E99787";
const YELLOW_COLOR = "#F1F67F";
const BLACK_COLOR = "#000000";

// Ball variables
let ballX = 100;
let ballY = 400;
let ballRadius = 10;

let ballDX = 5;
let ballDY = 5;

// Paddle Variables
let paddleHeight = 20;
let paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = CANVAS_HEIGHT - paddleHeight;
let paddleDX = 0;

let paddleSpeed = 10;

// Brick Variables
let brickRowCount = 6;
let brickColumnCount = 6;
let brickWidth = 150;
let brickHeight = 30;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Score
let score = 0;

// Lives
let lives = 3;

// Button Presses
let rightPressed = false;
let leftPressed = false;

/**
 * Resizes the canvas based on client window size to match css dimensions
 */
function resizeCanvas() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (canvas.width != width || canvas.height != height) {
    canvas.width = width;
    canvas.height = height;
  }
}

/**
 * Sets the canvas to a defined size
 * @param  {Number} width   Canvas width
 * @param  {Number} height  Canvas width
 */
function setCanvas(width, height) {
  canvas.width = width;
  canvas.height = height;
}

/**
 * Draw the ball according to given dimensions
 * @param {Context} ctx   Canvas Context
 * @param {Number} x      Ball X
 * @param {Number} y      Ball Y
 * @param {Number} r      Ball Radius
 */
function drawBall(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = BLUE_COLOR;
  ctx.fill();
  ctx.closePath();
}

/**
 * Moves the ball according to a given speed
 * @param {Number} dx   Speed in x direction
 * @param {Number} dy   Speed in y direction
 */
function moveBall(dx, dy) {
  ballX += dx;
  ballY += dy;
}

/**
 * Detects collision of ball to edges of canvas
 */
function detectCollision() {
  ballCollision();
  brickCollision();
}

/**
 * Detects collision of ball to bricks
 */
function brickCollision() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (
        ballX + ballRadius > b.x &&
        ballX - ballRadius < b.x + brickWidth &&
        ballY + ballRadius > b.y &&
        ballY - ballRadius < b.y + brickHeight &&
        b.status == 1
      ) {
        ballDY = -ballDY;
        b.status = 0;
        score++;
        checkWin();
      }
    }
  }
}

/**
 * Compares the scores with the total number of blocks to determine if player has won
 */
function checkWin() {
  if (score == brickRowCount * brickColumnCount) {
    alert("YOU WIN!!");
    document.location.reload();
  }
}

/**
 * Detects collision of ball to paddle and borders
 */
function ballCollision() {
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  }
  if (
    ballX + ballDX + ballRadius > canvas.width ||
    ballX + ballDX < ballRadius
  ) {
    ballDX = -ballDX;
  }

  if (
    ballX > paddleX &&
    ballX < paddleX + paddleWidth &&
    ballY + ballDY > paddleY - ballRadius
  ) {
    ballDY = -ballDY;
  }

  if (ballY + ballDY + ballRadius > canvas.height) {
    ballDY = 0;
    ballDX = 0;
  }
}

/**
 * Draws the paddle
 */
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = BLUE_COLOR;
  ctx.fill();
  ctx.closePath();
}

/**
 * Handles the paddle movement
 */
function movePaddle() {
  if (rightPressed) {
    paddleDX = paddleSpeed;
    paddleX += paddleDX;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleDX = -paddleSpeed;
    paddleX += paddleDX;
    if (paddleX < 0) {
      paddleX = 0;
    }
  } else if (paddleDX > 0) {
    smoothStopRight();
  } else if (paddleDX < 0) {
    smoothStopLeft();
  }
}

/**
 * Smooths the stop of the paddle when right key is let go
 */
function smoothStopRight() {
  paddleDX -= 0.1;
  paddleX += paddleDX;
  if (paddleDX < 0) {
    paddleDX = 0;
  }
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
}

/**
 * Smooths the stop of the paddle when left key is let go
 */
function smoothStopLeft() {
  paddleDX += 0.1;
  paddleX += paddleDX;
  if (paddleDX > 0) {
    paddleDX = 0;
  }
  if (paddleX < 0) {
    paddleX = 0;
  }
}

/**
 * Draws the bricks
 */
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        if (r % 3 == 0) ctx.fillStyle = RED_COLOR;
        if (r % 3 == 1) ctx.fillStyle = GREEN_COLOR;
        if (r % 3 == 2) ctx.fillStyle = YELLOW_COLOR;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/**
 * Checks if ball has reached bottom of canvas
 */
function detectEndGame() {
  if (ballY + ballDY > canvas.height - ballRadius) {
    lives--;
    if (!lives) {
      alert("GAME OVER");
      document.location.reload();
    } else {
      ballX = canvas.width / 2;
      ballY = canvas.height - 30;
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }
}

/**
 * Draws the score on the board
 */
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = BLUE_COLOR;
  ctx.fillText("Score: " + score, 8, 20);
}

/**
 * Draw numbers of lives on the screen
 */
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

/**
 * Updates the canvas to move everything
 */
function paint() {
  detectEndGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBricks();
  movePaddle();
  drawBall(ctx, ballX, ballY, ballRadius);
  detectCollision();
  moveBall(ballDX, ballDY);
  drawScore();
  drawLives();
  requestAnimationFrame(paint);
}

/**
 * Add button listeners
 */
function addListeners() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}

/**
 * Handles key presses
 * @param {Event} e Event
 */
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

/**
 * Handles key releases
 * @param {Event} e Event
 */
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
    paddleDX = 2;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
    paddleDX = -2;
  }
}

/**
 * Moves paddle with mouse cursor
 * @param {Event} e Mouse Move event
 */
function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
/**
 * Main function
 */
function main() {
  setCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  addListeners();
  paint();
  window.onresize = paint;
}

main();
