import {Room} from '../entity/Room.js';
import {renderFrame} from "./render.js";
import {updatePlayer} from "./controls.js";
import {gameClient} from "../client/GameClient.js";

let gameState = {
    playerX: 32.0,
    playerY: 32.0,
    playerA: 0.0
};


const updateInterval = window.setInterval(update, 16);
const deltaTime = 0.016;
const fov = 3.14159 / 4.0;
const depth = 61.0;
const steps = 0.02;

const roomSize = 9;
let currentRoom;

window.addEventListener("load", load);
window.addEventListener("unload", unload);

async function load() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    currentRoom = new Room(30, 30, roomSize, ['n', 'e', 'w']);
    currentRoom.renderWalls();

    await gameClient.updatePersonInfo();
}

async function unload() {
    window.clearInterval(updateInterval);
}

async function update() {
    await updatePlayer();
    await renderFrame();
}

export {gameState, currentRoom, depth, fov, steps, deltaTime};
