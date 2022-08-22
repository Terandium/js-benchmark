// Init vars
let canvas, fpsCounter, ctx, eventListener, canvasHeight, canvasWidth;
const objects = [];
const times = [];
let fps;
const ballRadius = 10;

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// Runs when HTML DOM is loaded
function setup() {
    if (eventListener) {
        document.removeEventListener('DOMContentLoaded', setup);
    }
    canvas = document.getElementById('benchmarkCanvas');
    fpsCounter = document.getElementById('fpsCounter');
    ctx = canvas.getContext('2d');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    canvasHeight = canvas.height;
    canvasWidth = canvas.width;

    benchmarkLoop();

    draw();
}

// Runs when body calls onLoad
function init() {
    if (document.readyState !== 'loading') {
        setup();
    } else {
        eventListener = true;
        document.addEventListener('DOMContentLoaded', setup);
    }
}

function spawnDots(amount) {
    for (let i = 0; i < amount; i++) {

        let x = Math.floor(Math.random() * canvasWidth);
        let y = Math.floor(Math.random() * canvasHeight);
        let dx = Math.floor(Math.random() * 8);
        let dy = Math.floor(Math.random() * 8);
        let color = Math.floor(Math.random()*16777215).toString(16);
        // let size = clamp(Math.floor(Math.random() * 25), 10, 45);
        let dot = new Ball(x, y, dx, dy, '#' + color, 10)
        objects.push(dot);
        dot.draw();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        obj.draw();
    });
}

// The benchmark loop
function benchmarkLoop() {
    window.requestAnimationFrame(() => {
        // Draw the frames on screen.
        draw();
        // Get the fps and amount of objects on screen.
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;

        fpsCounter.textContent = "fps: " + fps + " | objects: " + objects.length;

        //Add dots to screen
        if(fps > 40) {
            spawnDots(10)
        }
        //spawnDots(10);

        benchmarkLoop();
    });
}

class Ball {
    constructor(x, y, dx, dy, ballColour, ballRadius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.ballColour = ballColour;
        this.ballRadius = ballRadius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI*2);
        ctx.fillStyle = this.ballColour;
        ctx.fill();
        ctx.closePath();

        this.update();
    }

    update() {
        if(this.x + this.dx > canvasWidth-this.ballRadius || this.x + this.dx < this.ballRadius) {
            this.dx = -this.dx;
        }
        if(this.y + this.dy > canvasHeight-this.ballRadius || this.y + this.dy < this.ballRadius) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }
}