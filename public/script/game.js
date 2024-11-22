import {Room} from '../entity/Room.js';
import {updatePlayer, gameStarted} from "./controls.js";
import {gameClient} from "../client/GameClient.js";
import {displayStartScreen, loadTextures, renderFrame, setRoomDescription, setRoomTitle} from "./render.js";
import {renderInventory} from "./inventory.js";
import {renderMap, displayStartScreenMap} from "./map.js";
import {positionPlayerInCenterOfRoom} from "./generator.js";

let location = {
    playerX: 30.0,
    playerY: 30.0,
    playerA: 0.0
};

window.addEventListener("load", load);
window.addEventListener("unload", unload);
let updateInterval;

const deltaTime = 0.016;
const fov = 3.14159 / 4.0;
const depth = 61.0;
const steps = 0.01;

const rooms = [];

async function load() {
    updateInterval = window.setInterval(update, deltaTime * 1000);
}

export async function init() {
    await loadTextures();
    const position = await gameClient.positionClient.getPosition();
    rooms.push(new Room(30, 30, 11, position));
    positionPlayerInCenterOfRoom(30, 30, 11, 0, -3);
    setRoomTitle(position.name);
    setRoomDescription(position.description);
}

async function unload() {
    window.clearInterval(updateInterval);
}

async function update() {
    if (!gameStarted){
        await displayStartScreen();
        await displayStartScreenMap();
        return;
    }

    await updatePlayer();
    await renderFrame();
    await renderInventory();
    await renderMap();
}

export {location, depth, fov, steps, deltaTime, rooms};
