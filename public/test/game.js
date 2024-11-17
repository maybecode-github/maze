window.addEventListener("load", load);
window.addEventListener("unload", unload);
const updateInterval = window.setInterval(update, 16);

let playerX = 32.0;
let playerY = 32.0;
let playerA = 0.0;

const deltaTime = 0.016;
const fov = 3.14159 / 4.0;
const depth = 61.0;

let keys = {};

// create example room
const roomSize = 3; // room size (example: 3x3)
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
    updatePlayer();

    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    for (let x = 0; x < screen.width; x++) {
        let rayAngle = (playerA - fov / 2.0) + (parseFloat(x) / screen.width) * fov;
        let distanceToWall = 0.0;
        let hitWall = false;

        let eyeX = Math.sin(rayAngle);
        let eyeY = Math.cos(rayAngle);

        while (!hitWall && distanceToWall < depth) {
            distanceToWall += 0.1;

            let testX = parseInt(playerX + eyeX * distanceToWall);
            let testY = parseInt(playerY + eyeY * distanceToWall);

            // beam outside of map
            if (testX < 0 || testX >= currentRoom.mapWidth || testY < 0 || testY >= currentRoom.mapHeight) {
                hitWall = true;
                distanceToWall = depth;
            } else {
                if (currentRoom.map[testY * currentRoom.mapWidth + testX] > 0) { // Block
                    hitWall = true;
                }
            }
        }

        const ceiling = Math.round(parseFloat(screen.height / 2.0) - screen.height / distanceToWall);
        const floor = screen.height - ceiling;

        ctx.beginPath();

        ctx.moveTo(x, screen.height);
        ctx.lineTo(x, floor);
        const gradient = ctx.createLinearGradient(x, screen.height, x, floor);
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "black");
        ctx.strokeStyle = gradient;
        ctx.stroke();

        ctx.lineTo(x, ceiling);
        ctx.strokeStyle = `rgb(from red r g b / ${100 - distanceToWall * 8}%)`;
        ctx.stroke();
    }
}
