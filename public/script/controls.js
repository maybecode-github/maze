import {deltaTime, firstRoom, location} from "./game.js";
import {dropItem, nextInventorySlot, previousInventorySlot} from "./inventory.js";
import {getClosestPassable, switchRoom} from "./player.js";
import {gameClient} from "../client/GameClient.js";
import {closestItem, renderFrame} from "./render.js";
import {renderMap} from "./map.js";

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
window.addEventListener("mousedown", mousedown);
window.addEventListener("mousemove", mousemove);
window.addEventListener("mouseup", mouseup);

const walkSpeed = 10;
const strafeSpeed = 5;
const lookSpeed = 3;
const runMultiplier = 2;
let isMapVisible = false;

let mapOffsetX = 0;
let mapOffsetY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let keys = {};

async function mousedown(event) {
    if (isMapVisible) {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
    }
}

async function mousemove(event) {
    if (isMapVisible && isDragging) {
        const dx = event.clientX - dragStartX;
        const dy = event.clientY - dragStartY;

        mapOffsetX += dx;
        mapOffsetY += dy;

        dragStartX = event.clientX;
        dragStartY = event.clientY;

        renderMap();
    }
}

async function mouseup(event) {
    isDragging = false;
}

async function keydown(event) {
    const keyCode = event.key.toLowerCase();

    //Inventory Controls
    if (keyCode === "arrowup") await nextInventorySlot();
    else if (keyCode === "arrowdown") await previousInventorySlot();
    else if (keyCode === "q") await dropItem();
    else if (keyCode === "e") {
        if (closestItem != null)
        {
            await gameClient.personClient.takeThing(closestItem);
        }

        if (getClosestPassable() == null) {
            return;
        }

        // standard Blickrichtung süden, nach rechts runter ist Osten
        // dann norden, dann westen
        let passable = getClosestPassable();
        console.log("passable", passable);
        passable.door.then(door => {
            if (door.lock) {
                return;
            }
            if (!door.closable) {
                return;
            }
            if (door.open) {
                door.close = true;
                door.open = false;
                gameClient.doorClient.changeDoorStatus(passable.direction, "close");
            } else {
                door.close = false;
                door.open = true;
                gameClient.doorClient.changeDoorStatus(passable.direction, "open");
            }
        });
    } else if (keyCode === "f") {
        if (getClosestPassable() == null) {
            return;
        }

        let passable = getClosestPassable();
        passable.door.then(door => {
            if (door.lock) {
                return;
            }
            if (!door.open) {
                return;
            }

            console.log(passable.direction);
            switchRoom(passable.direction);

            // switch room
            console.log("YOUR ROOM WAS SWITCHED!");
        });
    } else if (keyCode === "m") {
        isMapVisible = !isMapVisible;
        if (isMapVisible) {
            renderMap();
        } else {
            await renderFrame();
        }
    }
    //Regular Controls
    else keys[keyCode] = true;
}

async function keyup(event) {
    keys[event.key.toLowerCase()] = false;
}

async function updatePlayer() {
    const run = keys["shift"] ? runMultiplier : 1;

    // Look left
    if (keys["arrowleft"]) {
        location.playerA -= lookSpeed * deltaTime;
    }

    // Look right
    if (keys["arrowright"]) {
        location.playerA += lookSpeed * deltaTime;
    }

    // Move forward
    if (keys["w"]) {
        location.playerX += Math.sin(location.playerA) * walkSpeed * run * deltaTime;
        location.playerY += Math.cos(location.playerA) * walkSpeed * run * deltaTime;

        // Collision
        if (firstRoom.map[Math.floor(location.playerY) * firstRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX -= Math.sin(location.playerA) * walkSpeed * run * deltaTime;
            location.playerY -= Math.cos(location.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Move backwards
    if (keys["s"]) {
        location.playerX -= Math.sin(location.playerA) * walkSpeed * run * deltaTime;
        location.playerY -= Math.cos(location.playerA) * walkSpeed * run * deltaTime;

        // Collision
        if (firstRoom.map[Math.floor(location.playerY) * firstRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX += Math.sin(location.playerA) * walkSpeed * run * deltaTime;
            location.playerY += Math.cos(location.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Strafe left
    if (keys["a"]) {
        location.playerX -= Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
        location.playerY += Math.sin(location.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (firstRoom.map[Math.floor(location.playerY) * firstRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX += Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
            location.playerY -= Math.sin(location.playerA) * strafeSpeed * run * deltaTime;
        }
    }

    // Strafe right
    if (keys["d"]) {
        location.playerX += Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
        location.playerY -= Math.sin(location.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (firstRoom.map[Math.floor(location.playerY) * firstRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX -= Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
            location.playerY += Math.sin(location.playerA) * strafeSpeed * run * deltaTime;
        }
    }

}

export {updatePlayer, isMapVisible, mapOffsetY, mapOffsetX};
