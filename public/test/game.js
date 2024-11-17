window.addEventListener("load", load);
window.addEventListener("unload", unload);
const updateInterval = window.setInterval(update, 16);

let playerX = 32.0;
let playerY = 32.0;
let playerA = 0.0;

const deltaTime = 0.016;
const fov = 3.14159 / 4.0;
const depth = 61.0;
const steps = 0.02;

// create example room
const roomSize = 9; // room size (example: 3x3)
let currentRoom = new Room(30, 30, roomSize, ['n', 'e', 'w']); // create room object

async function load() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    // render walls
    currentRoom.renderWalls();
}

async function unload() {
    window.clearInterval(updateInterval);
}

async function update() {
    await updatePlayer();
    await renderFrame();
}
