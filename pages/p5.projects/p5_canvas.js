// function setup() {
//     createCanvas(500, 500);
//     // background(1);
//     stroke(153);
//     strokeWeight(1);
//     strokeCap(SQUARE);
//
//     let a = 100;
//     let b = 100;
//     let s = 4;
//
//     for (let i = 0; i < 101; i++) {
//         line(a, b + s * i, a + s * 100, b + s * i);
//         line(a + s * i, b, a + s * i, b + s * 100);
//     }
//
// }
//
// let scale = 1.2;
//
// function setup() {
//     createCanvas(600 * scale, 300 * scale);
// }
//
// function draw() {
//     background(0);
//     noStroke();
//     for (let i = 0; i < height; i += 10) {
//         fill(129, 206, 15);
//         rect(0, i, width, 5);
//         fill(255);
//         rect(i, 0, 5, height);
//         rect(i + height, 0, 5, height);
//     }
// }
//
//
// let y;
//
// function setup() {
//     createCanvas(720, 400);
//     stroke(255);
//     noLoop();
//     y = height * 0.5;
// }
//
// function draw() {
//     background(0);
//     y = y - 10;
//     if (y < 0) {
//         y = height;
//     }
//     fill(129, 286, 15);
//     for (let i = 1; i <= 10; i++) {
//         rect(0, y + 10 * i, width, 5);
//         rect(y + 10 * i, 10, 5, height);
//     }
// }
//
// function mousePressed() {
//     redraw();
// }
//
//
//
// function setup() {
//     createCanvas(720, 400);
//     background(51);
//     noStroke();
//     noLoop();
// }
//
// function draw() {
//     drawTarget(width * 0.25, height * 0.4, 200, 200);
//     drawTarget(width * 0.5, height * 0.5, 300, 200);
//     drawTarget(width * 0.75, height * 0.3, 120, 200);
// }
//
// function drawTarget(xloc, yloc, size, num) {
//     const grayvalues = 255 / num;
//     const steps = size / num;
//     for (let i = 0; i < num; i++) {
//         fill(i * grayvalues);
//         ellipse(xloc - 0.2 * i, yloc + 0.2 * i, size - i * steps, size - i * steps);
//     }
// }
//
// function setup() {
//     createCanvas(720, 400);
//     stroke(255);
//     noFill();
// }
//
// function draw() {
//     background(0);
//     for (let i = 0; i < 200; i += 10) {
//         bezier(
//             mouseX, mouseY,
//             mouseX / 2, mouseY / 2,
//             mouseX / 2, mouseY / 2,
//             mouseX, mouseY
//         );
//     }
// }
//
//
// let pg;
//
// function setup() {
//     createCanvas(innerWidth, innerHeight);
//     // pg = createGraphics(400, 250);
// }
//
// function draw() {
//     fill(0, 12);
//     rect(0, 0, width, height);
//     fill(255);
//     noStroke();
//     ellipse(mouseX, mouseY, 20, 20);
//     for (let r = 1; r <= 200; r += 20) {
//         ellipse(mouseX + r, mouseY + r, 20, 20);
//         ellipse(mouseX - r, mouseY - r, 20, 20);
//         ellipse(mouseX - r, mouseY + r, 20, 20);
//         ellipse(mouseX + r, mouseY - r, 20, 20);
//     }
// }


let flock;

function setup() {
    createCanvas(640, 360);
    createP("Drag the mouse to generate new boids.");

    flock = new Flock();
    // Add an initial set of boids into the system
    for (let i = 0; i < 100; i++) {
        let b = new Boid(width / 2, height / 2);
        flock.addBoid(b);
    }
}

function draw() {
    background(51);
    flock.run();
}

// Add a new boid into the System
function mouseDragged() {
    flock.addBoid(new Boid(mouseX, mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
    // An array for all the boids
    this.boids = []; // Initialize the array
}

Flock.prototype.run = function () {
    for (let i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
    }
}

Flock.prototype.addBoid = function (b) {
    this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 3.0;
    this.maxspeed = 3;    // Maximum speed
    this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function (boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
}

Boid.prototype.applyForce = function (force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function (boids) {
    let sep = this.separate(boids);   // Separation
    let ali = this.align(boids);      // Alignment
    let coh = this.cohesion(boids);   // Cohesion
    // Arbitrarily weight these forces
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    // Add the force vectors to acceleration
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function () {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelertion to 0 each cycle
    this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function (target) {
    let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
}

Boid.prototype.render = function () {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + radians(90);
    fill(127);
    stroke(200);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
}

// Wraparound
Boid.prototype.borders = function () {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function (boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    // For every boid in the system, check if it's too close
    for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if ((d > 0) && (d < desiredseparation)) {
            // Calculate vector pointing away from neighbor
            let diff = p5.Vector.sub(this.position, boids[i].position);
            diff.normalize();
            diff.div(d);        // Weight by distance
            steer.add(diff);
            count++;            // Keep track of how many
        }
    }
    // Average -- divide by how many
    if (count > 0) {
        steer.div(count);
    }

    // As long as the vector is greater than 0
    if (steer.mag() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
    }
    return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function (boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].velocity);
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        let steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
    } else {
        return createVector(0, 0);
    }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function (boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
    let count = 0;
    for (let i = 0; i < boids.length; i++) {
        let d = p5.Vector.dist(this.position, boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].position); // Add location
            count++;
        }
    }
    if (count > 0) {
        sum.div(count);
        return this.seek(sum);  // Steer towards the location
    } else {
        return createVector(0, 0);
    }
}


