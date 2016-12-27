var body = document.body;
var canvas = document.createElement('canvas');
var c = canvas.getContext('2d');
var radius = 30;
var x = radius;
var y = radius;
var vx = 0;
var vy = 0;
var ax = 30;
var ay = 30;
var frictionX = 5;
var frictionY = 5;
var vxMax = 200;
var vyMax = 200;
var lastUpdate;
var dt;
var keyPressed = { up: false, down: false, right: false, left: false };

body.appendChild(canvas);

canvas.width = 640;
canvas.height = 480;
canvas.style.backgroundColor = '#efefef';
canvas.style.border = '2px solid #aaa';
canvas.style.display = 'block';
canvas.style.margin = '10px auto';
//canvas.style.borderRadius = '8px';

function drawTheBall() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI*2);
  c.fillStyle = 'orange';
  c.fill();
  //c.lineWidth = 3;
  //c.strokeStyle = '#aaa';
  //c.stroke();
}

function update(dt) {
  if (keyPressed.right) move('right');
  if (keyPressed.left) move('left');
  if (keyPressed.up) move('up');
  if (keyPressed.down) move('down');

  slowDown();

  x += vx * dt;
  y += vy * dt;

  if (x > canvas.width + radius) x = -radius;
  if (y > canvas.height + radius) y = -radius;
  if (x < -radius) x = canvas.width + radius;
  if (y < -radius) y = canvas.height + radius;

  drawTheBall();
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
function slowDown() {
  var directionH = vx > 0 ? 'right' : 'left';
  var directionY = vy > 0 ? 'down' : 'up';

  if (directionH === 'right' && Math.floor(vx) > 0) vx = vx - frictionX;
  else if (directionH === 'left' && Math.ceil(vx) < 0) vx = vx + frictionX;
  else vx = 0;

  if (directionY === 'down' && Math.floor(vy) > 0) vy = vy - frictionY;
  else if (directionY === 'up' && Math.ceil(vy) < 0) vy = vy + frictionY;
  else vy = 0;

}

function move(direction) {
  if (direction === 'right' && vx < vxMax) vx = vx + ax;
  else if (direction === 'left' && vx > -vxMax) vx = vx - ax;
  else if (direction === 'down' && vy < vyMax) vy = vy + ay;
  else if (direction === 'up' && vy > -vyMax) vy = vy - ay;
}

function isMoving() {
  for (var key in keyPressed) {
    if (keyPressed.hasOwnProperty(key) && keyPressed[key]) return true;
  }

  return false;
}

document.addEventListener('keydown', function(e) {
  if (e.keyCode == 39) keyPressed.right = true;
  if (e.keyCode == 37) keyPressed.left = true;

  if (e.keyCode == 38) keyPressed.up = true;
  if (e.keyCode == 40) keyPressed.down = true;

  if (e.keyCode == 13) canvas.webkitRequestFullscreen();
});

document.addEventListener('keyup', function(e) {
  if (e.keyCode == 39) keyPressed.right = false;
  if (e.keyCode == 37) keyPressed.left = false;

  if (e.keyCode == 38) keyPressed.up = false;
  if (e.keyCode == 40) keyPressed.down = false;
});

main(window.performance.now());
