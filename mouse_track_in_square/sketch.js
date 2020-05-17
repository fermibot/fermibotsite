let bx;
let by;
let boxSize = 75;
let num = 15;
let mx = [];
let my = [];

function setup() {
  createCanvas(720, 400);
  bx = width / 2.0;
  by = height / 2.0;
  rectMode(RADIUS);
  strokeWeight(2);
  
  noStroke();
  fill(255, 153);
  for (let i = 0; i < num; i++) {
    mx.push(i);
    my.push(i);
  }
}

function draw() {
  background(255,99,71);
  rect(bx, by, boxSize, boxSize);
  if (
    mouseX > bx - boxSize &&
    mouseX < bx + boxSize &&
    mouseY > by - boxSize &&
    mouseY < by + boxSize
  )
  {

  // Cycle through the array, using a different entry on each frame.
  // Using modulo (%) like this is faster than moving all the values over.
  let which = frameCount % num;
  mx[which] = mouseX;
  my[which] = mouseY;

  for (let i = 0; i < num; i++) {
    // which+1 is the smallest (the oldest in the array)
    let index = (which + i) % num;
    ellipse(mx[index], my[index], i, i);
  }
  }
}
