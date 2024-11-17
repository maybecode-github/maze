window.addEventListener("load", load);
window.addEventListener("unload", unload);
const updateInterval = window.setInterval(update, 16);

let playerX = 32.0;
let playerY = 32.0;
let playerA = 0.0;

const deltaTime = 0.016;
const fov = 3.14159 / 4.0;
const depth = 61.0;

const mapWidth = 61;
const mapHeight = 61;
let map = Array(mapWidth * mapHeight).fill(0); // default 0 (no wall)

let keys = {};

const roomSize = 9; // size of room (3x3 for example)

async function load() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    renderWalls(); // render walls
}

/**
 * room with specific door directions
 * @param x
 * @param y
 * @param roomSize
 * @param doorDirections
 */
function createRoom(x, y, roomSize = 3, doorDirections = []) {
    // Erstelle eine leere Map (Standard 0 = leer)
    map = Array(mapWidth * mapHeight).fill(0);

    // set walls with doors in given directions
    setWalls(x, y, roomSize, doorDirections);

    // person always in middle of the room
    playerX = x + Math.floor(roomSize / 2);
    playerY = y + Math.floor(roomSize / 2);

    // render walls on screen
    renderWalls(roomSize);
}

function setWalls(roomX, roomY, roomSize, doorDirections) {
    const wallSize = roomSize + 2;

    // calculation of door position in the middle of the wall
    const doorPos = Math.floor(wallSize / 2);

    // set all walls
    // north wall
    for (let i = 0; i < wallSize; i++) {
        map[(roomY * mapWidth) + roomX + i] = 2; // Wand
    }

    // south wall
    for (let i = 0; i < wallSize; i++) {
        map[((roomY + wallSize - 1) * mapWidth) + roomX + i] = 2; // Wand
    }

    // west wall
    for (let i = 0; i < wallSize; i++) {
        map[((roomY + i) * mapWidth) + roomX] = 2; // Wand
    }

    // east wall
    for (let i = 0; i < wallSize; i++) {
        map[((roomY + i) * mapWidth) + roomX + wallSize - 1] = 2; // Wand
    }

    // remove walls for doors in middle of walls
    doorDirections.forEach(direction => {
        switch (direction) {
            case 'n':
                map[(roomY * mapWidth) + roomX + doorPos] = 0; // north
                break;
            case 's':
                map[((roomY + wallSize - 1) * mapWidth) + roomX + doorPos] = 0; // south
                break;
            case 'w':
                map[((roomY + doorPos) * mapWidth) + roomX] = 0; // west
                break;
            case 'e':
                map[((roomY + doorPos) * mapWidth) + roomX + wallSize - 1] = 0; // east
                break;
            default:
                console.log("Invalid direction: ", direction);
        }
    });
}

// render walls on screen
function renderWalls() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.fillRect(0, 0, screen.width, screen.height);

    // render walls
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (map[y * mapWidth + x] === 2) { // wall block
                ctx.fillRect(x * 10, y * 10, 10, 10); // draws wall
            } else if (map[y * mapWidth + x] === 0) { // checks for door
                ctx.fillStyle = "transparent"; // no wall = door
            }
        }
    }
}

// create example room
createRoom(30, 30, roomSize, ['n', 'e', 'w']);

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

            //ray out of bounds
            if (testX < 0 || testX >= mapWidth || testY < 0 || testY >= mapHeight) {
                hitWall = true;
                distanceToWall = depth;
            } else {
                if (map[testY * mapWidth + testX] > 0) { // Block
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
