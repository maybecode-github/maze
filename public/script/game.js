import {Room} from '../entity/Room.js';
import {loadTexture, renderFrame} from "./render.js";
import {updatePlayer} from "./controls.js";
import {gameClient} from "../client/GameClient.js";

let gameState = {
    playerX: 32.0,
    playerY: 32.0,
    playerA: 0.0
};

window.addEventListener("load", load);
window.addEventListener("unload", unload);
let updateInterval;
let wallTexture;

const deltaTime = 0.032;
const fov = 3.14159 / 4.0;
const depth = 61.0;
const steps = 0.01;

const roomSize = 9;
let firstRoom;

const rooms = [];

async function load() {
    let position = await gameClient.positionClient.getPosition();

    // Create rooms
    firstRoom = new Room(30, 30, roomSize, position.color, position.directions);
    let secondRoom = new Room(30, 40, roomSize, position.color, position.directions);
    let thirdRoom = new Room(20, 30, roomSize, position.color, position.directions);

    // Set player position only once
    gameState.playerX = 30 + Math.floor(roomSize / 2);
    gameState.playerY = 30 + Math.floor(roomSize / 2);

    // Render all rooms
    firstRoom.renderWalls();

    wallTexture = await loadTexture("./image/brick.png");

    updateInterval = window.setInterval(update, 32);
}

async function unload() {
    window.clearInterval(updateInterval);
}

async function update() {
    await updatePlayer();
    await renderFrame();
}

export {gameState, firstRoom, depth, fov, steps, deltaTime, wallTexture, rooms};
