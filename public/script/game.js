import {Room} from '../entity/Room.js';
import {updatePlayer} from "./controls.js";
import {gameClient} from "../client/GameClient.js";
import {loadTextures, renderFrame} from "./render.js";
import {renderInventory} from "./inventory.js";
import {isMapVisible} from "./controls.js";

let location = {
    playerX: 32.0,
    playerY: 32.0,
    playerA: 0.0
};

window.addEventListener("load", load);
window.addEventListener("unload", unload);
let updateInterval;

const deltaTime = 0.032;
const fov = 3.14159 / 4.0;
const depth = 61.0;
const steps = 0.01;

const roomSize = 11;
let firstRoom;

const rooms = [];

async function load() {
    let position = await gameClient.positionClient.getPosition();

    // Create rooms
    firstRoom = new Room(30, 30, roomSize, position);

    // Set player position only once
    location.playerX = 30 + Math.floor(roomSize / 2);
    location.playerY = 30 + Math.floor(roomSize / 2);

    await loadTextures();

    updateInterval = window.setInterval(update, 32);
}

async function unload() {
    window.clearInterval(updateInterval);
}

async function update() {
    if (isMapVisible) {
        return;
    }
    await updatePlayer();
    await renderFrame();
    await renderInventory();
}

export {location, firstRoom, depth, fov, steps, deltaTime, rooms};
