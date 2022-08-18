let canvas, fpsCounter, ctx, eventListener, canvasHeight, canvasWidth;
let objects = 0;
const times = [];
let fps;

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

    refreshLoop();

    loop();
    setInterval(loop, 0);
}

function init() {
    if (document.readyState !== 'loading') {
        setup();
    } else {
        eventListener = true;
        document.addEventListener('DOMContentLoaded', setup);
    }
}

function spawnDots(amount) {
    objects = amount;
    for (let i = 0; i < amount; i++) {
        let x = Math.floor(Math.random() * canvasWidth);
        let y = Math.floor(Math.random() * canvasHeight);
        let color = Math.floor(Math.random()*16777215).toString(16);
        let size = clamp(Math.floor(Math.random() * 25), 10, 45);
        let dot = new Dot(x, y, size, '#' + color)
        dot.draw();
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    spawnDots(1000);
}

class Dot {
    constructor (
        x = 0, y = 0,
        radius = 45,
        fillColor = 'blue'
    ) {
        this.x = Number(x)
        this.y = Number(y)
        this.radius = Number(radius)
        this.fillColor = fillColor
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getRadius() {
        return this.radius;
    }

    // draw dot to screen
    draw() {
        // saves the current styles set elsewhere
        // to avoid overwriting them
        ctx.save()

        // set the styles for this shape
        ctx.fillStyle = this.fillColor

        // create the *path*
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);

        // draw the path to screen
        ctx.fill();

        // restores the styles from earlier
        // preventing the colors used here
        // from polluting other drawings
        ctx.restore()
    }
}

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;

        fpsCounter.textContent = "fps: " + fps + " | objects: " + objects;

        refreshLoop();
    });
}