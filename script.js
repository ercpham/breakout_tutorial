// Capture canvas and context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Canvas constants
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;

// Ball constants
const BALL_COLOR = "#0095DD";

// Ball variables
let ballX = 50;
let ballY = 50;
let ballRadius = 7;

let ballDX = 2;
let ballDY = 2;

// Paddle Variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = CANVAS_HEIGHT-paddleHeight;
let paddleDX = 7;

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
  ctx.fillStyle = BALL_COLOR;
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
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  }
  if (
    ballX + ballDX + ballRadius > canvas.width ||
    ballX + ballDX < ballRadius
  ) {
    ballDX = -ballDX;
  }

  if (ballX > paddleX && ballX < paddleX + paddleWidth && ballY + ballDY > paddleY - ballRadius) {
    ballDY = -ballDY;
  }

  if (ballY + ballDY + ballRadius > canvas.height) {
    ballDY = 0;
    ballDX = 0;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = BALL_COLOR;
  ctx.fill();
  ctx.closePath();
}

function movePaddle() {
  if (rightPressed) {
    paddleDX = 7;
    paddleX += paddleDX;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleDX = 7;
    paddleX -= paddleDX;
    if (paddleX < 0) {
      paddleX = 0;
    }
  } else {
    if (paddleDX > 0) {
        paddleDX -= 0.5;
        paddleX += paddleDX;
    }
  }
}

function detectEndGame() {
  if (ballY + ballDY > canvas.height - ballRadius) {
    alert("Game over");
    document.location.reload();
    clearInterval(null);
  }
}

/**
 * Updates the canvas to move everything
 */
function paint() {
  detectEndGame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  movePaddle();
  drawBall(ctx, ballX, ballY, ballRadius);
  detectCollision();
  moveBall(ballDX, ballDY);
}

/**
 * Add button listeners
 */
function addListeners() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
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
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

/**
 * Main function
 */
function main() {
  setCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  addListeners();
  setInterval(paint, 10);
  window.onresize = paint;
}

main();
