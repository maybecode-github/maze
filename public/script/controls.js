import {deltaTime, firstRoom, location} from "./game.js";
import {dropItem, nextInventorySlot, previousInventorySlot} from "./inventory.js";
import {getClosestPassable} from "./player.js";
import {gameClient} from "../client/GameClient.js";

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const walkSpeed = 10;
const strafeSpeed = 5;
const lookSpeed = 3;
const runMultiplier = 2;

let keys = {};

async function keydown(event) {
    const keyCode = event.key.toLowerCase();

    //Inventory Controls
    if (keyCode === "arrowup") await nextInventorySlot();
    else if (keyCode === "arrowdown") await previousInventorySlot();
    else if (keyCode === "q") await dropItem();
    else if (keyCode === "e") {
        if (getClosestPassable() == null) {
            return;
        }

        let passable = getClosestPassable();
        passable.door.then(door => {
            if (door.lock) {
                console.log("door locked");
                return;
            }
            if (!door.closable) {
                return;
            }
            if (door.open) {
                door.close = true;
                door.open = false;
                gameClient.doorClient.changeDoorStatus(passable.direction, "close");
                console.log("door closed")
            } else {
                door.close = false;
                door.open = true;
                gameClient.doorClient.changeDoorStatus(passable.direction, "open");
                console.log("door opened")
            }
        });
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

export {updatePlayer};
