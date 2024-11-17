import { gameState, deltaTime, currentRoom } from "./game.js";

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const walkSpeed = 10;
const strafeSpeed = 5;
const lookSpeed = 3;
const runMultiplier = 2;

let keys = {};

async function keydown(event) {
    keys[event.key.toLowerCase()] = true;
}

async function keyup(event) {
    keys[event.key.toLowerCase()] = false;
}

async function updatePlayer() {
    const run = keys["shift"] ? runMultiplier : 1;

    // Look left
    if (keys["arrowleft"]) {
        gameState.playerA -= lookSpeed * deltaTime;
    }

    // Look right
    if (keys["arrowright"]) {
        gameState.playerA += lookSpeed * deltaTime;
    }

    // Move forward
    if (keys["w"]) {
        gameState.playerX += Math.sin(gameState.playerA) * walkSpeed * run * deltaTime;
        gameState.playerY += Math.cos(gameState.playerA) * walkSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(gameState.playerY) * currentRoom.mapWidth + Math.floor(gameState.playerX)] > 0) {
            gameState.playerX -= Math.sin(gameState.playerA) * walkSpeed * run * deltaTime;
            gameState.playerY -= Math.cos(gameState.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Move backwards
    if (keys["s"]) {
        gameState.playerX -= Math.sin(gameState.playerA) * walkSpeed * run * deltaTime;
        gameState.playerY -= Math.cos(gameState.playerA) * walkSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(gameState.playerY) * currentRoom.mapWidth + Math.floor(gameState.playerX)] > 0) {
            gameState.playerX += Math.sin(gameState.playerA) * walkSpeed * run * deltaTime;
            gameState.playerY += Math.cos(gameState.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Strafe left
    if (keys["a"]) {
        gameState.playerX -= Math.cos(gameState.playerA) * strafeSpeed * run * deltaTime;
        gameState.playerY += Math.sin(gameState.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(gameState.playerY) * currentRoom.mapWidth + Math.floor(gameState.playerX)] > 0) {
            gameState.playerX += Math.cos(gameState.playerA) * strafeSpeed * run * deltaTime;
            gameState.playerY -= Math.sin(gameState.playerA) * strafeSpeed * run * deltaTime;
        }
    }

    // Strafe right
    if (keys["d"]) {
        gameState.playerX += Math.cos(gameState.playerA) * strafeSpeed * run * deltaTime;
        gameState.playerY -= Math.sin(gameState.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(gameState.playerY) * currentRoom.mapWidth + Math.floor(gameState.playerX)] > 0) {
            gameState.playerX -= Math.cos(gameState.playerA) * strafeSpeed * run * deltaTime;
            gameState.playerY += Math.sin(gameState.playerA) * strafeSpeed * run * deltaTime;
        }
    }
}

export { updatePlayer };
