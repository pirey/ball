var body = document.body;
var canvas = document.createElement('canvas');
var c = canvas.getContext('2d');
var radius = 20;
var x = radius;
var y = radius;
var vx = 0;
var vy = 0;
var initialAX = 30;
var initialAY = 30;
var turboAX = 300;
var turboAY = 300;
var ax = initialAX;
var ay = initialAY;
var frictionX = 30;
var frictionY = 30;
var initialVxMax = 500;
var initialVyMax = 500;
var vxMax = initialVxMax;
var vyMax = initialVyMax;
var vxMaxTurbo = 1000;
var vyMaxTurbo = 1000;
var lastUpdate;
var dt;
var cursorPressed = { up: false, down: false, right: false, left: false };
var keyPressed = { space: false, b: false };
var ballColor = 'silver';


body.appendChild(canvas);

canvas.width = 600;
canvas.height = 600;
canvas.style.backgroundColor = '#efefef';
canvas.style.border = '2px solid #aaa';
canvas.style.display = 'block';
canvas.style.margin = '10px auto';

function drawTheBall() {
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI*2);
  c.fillStyle = ballColor;
  c.fill();

  drawBallDecoration();
}

function drawCircle() {
  c.beginPath();
  c.arc(canvas.width/2, canvas.height/2, 125, 0, Math.PI*2);
  c.strokeStyle = 'black';
  c.stroke();
  c.closePath();
}

function drawLines() {
  c.beginPath();

  c.moveTo(0, 0);
  c.lineTo(canvas.width, canvas.height);
  c.stroke();

  c.moveTo(0, canvas.height);
  c.lineTo(canvas.width, 0);
  c.stroke();

  c.closePath();
}

function drawBallDecoration() {
  c.beginPath();
  c.arc(x, y, 3, 0, Math.PI*2);
  c.fillStyle = 'white';
  c.fill();

  c.beginPath();
  c.arc(x, y, radius * 0.85, 0, Math.PI*2);
  c.strokeStyle = 'white';
  c.stroke();
  c.closePath();
}

function update(dt) {
  if (cursorPressed.right) move('right');
  if (cursorPressed.left) move('left');
  if (cursorPressed.up) move('up');
  if (cursorPressed.down) move('down');

  if (isMoving() && keyPressed.space) accelerate();

  slowDown();

  var xx = x;
  var yy = y;
  var hitWall = false;

  x += vx * dt;
  y += vy * dt;

  if (x > canvas.width - radius) {
    x = canvas.width - radius;
    vx = -vx;
    hitWall = true;
  }
  if (x < radius) {
    x = radius;
    vx = -vx;
    hitWall = true;
  }

  if (y > canvas.height - radius) {
    y = canvas.height - radius;
    vy = -vy;
    hitWall = true;
  }
  if (y < radius) {
    y = radius;
    vy = -vy;
    hitWall = true;
  }

  slowDown(hitWall ? 20 : null);

  //if (x > canvas.width + radius) x = -radius;
  //if (y > canvas.height + radius) y = -radius;
  //if (x < -radius) x = canvas.width + radius;
  //if (y < -radius) y = canvas.height + radius;

  c.clearRect(0, 0, canvas.width, canvas.height);
  //drawCircle();
  //drawLines();
  drawTheBall();
  debug(dt);
}

function main(elapsed) {
  window.requestAnimationFrame(main);

  if (!lastUpdate) lastUpdate = elapsed;

  dt = (elapsed - lastUpdate) / 1000;

  lastUpdate = elapsed;

  update(dt);
}

/**
 * Slows down until stopped
 *
 */
function slowDown(customFriction) {
  customFriction = customFriction || 2;

  var directionX = vx > 0 ? 'right' : 'left';
  var directionY = vy > 0 ? 'down' : 'up';
  var fx = frictionX;
  var fy = frictionY;

  // handle brake
  if (keyPressed.b) {
    fx = 40;
    fy = 40;
  }

  if (customFriction) {
    fx = customFriction;
    fy = customFriction;
  }

  if (directionX === 'right' && Math.floor(vx) > 0) vx = vx - fx;
  else if (directionX === 'left' && Math.ceil(vx) < 0) vx = vx + fx;
  else vx = 0;

  if (directionY === 'down' && Math.floor(vy) > 0) vy = vy - fy;
  else if (directionY === 'up' && Math.ceil(vy) < 0) vy = vy + fy;
  else vy = 0;

}

function move(direction) {
  if (direction === 'right' && vx < vxMax) vx = vx + ax;
  else if (direction === 'left' && vx > -vxMax) vx = vx - ax;
  else if (direction === 'down' && vy < vyMax) vy = vy + ay;
  else if (direction === 'up' && vy > -vyMax) vy = vy - ay;

  if (Math.round(vx) === 0) ax = initialAX;
  if (Math.round(vy) === 0) ay = initialAY;
}

function isMoving() {
  for (var key in cursorPressed) {
    if (cursorPressed.hasOwnProperty(key) && cursorPressed[key]) return true;
  }

  return false;
}

function accelerate() {
  ax = turboAX;
  ay = turboAY;
  vxMax = vxMaxTurbo;
  vyMax = vyMaxTurbo;
  ballColor = 'red';

  decelerate();
}

function decelerate() {

  window.setTimeout(function() {
    ax = initialAX;
    ay = initialAY;
    vxMax = initialVxMax;
    vyMax = initialVyMax;
    ballColor = 'silver';
  }, 1000);
}

var debugVX = document.getElementById('debug-speed-x');
var debugVY = document.getElementById('debug-speed-y');
var debugAX = document.getElementById('debug-acc-x');
var debugAY = document.getElementById('debug-acc-y');
function debug() {
  debugVX.textContent = vx;
  debugVY.textContent = vy;
  debugAX.textContent = ay;
  debugAY.textContent = ax;
}

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 39) cursorPressed.right = true;
  if (e.keyCode == 37) cursorPressed.left = true;

  if (e.keyCode == 38) cursorPressed.up = true;
  if (e.keyCode == 40) cursorPressed.down = true;

  if (e.keyCode == 32) keyPressed.space = true;
  if (e.keyCode == 66) keyPressed.b = true;

  if (e.keyCode == 13) canvas.webkitRequestFullscreen();
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode == 39) cursorPressed.right = false;
  if (e.keyCode == 37) cursorPressed.left = false;

  if (e.keyCode == 38) cursorPressed.up = false;
  if (e.keyCode == 40) cursorPressed.down = false;

  if (e.keyCode == 32) keyPressed.space = false;
  if (e.keyCode == 66) keyPressed.b = false;
});

main(window.performance.now(), true);
