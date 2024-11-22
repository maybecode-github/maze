import {deltaTime, location, init} from "./game.js";
import {dropItem, getItemInHand, nextInventorySlot, previousInventorySlot} from "./inventory.js";
import {getClosestPassable, switchRoom, getCurrentRoom} from "./player.js";
import {gameClient} from "../client/GameClient.js";
import {closestItem} from "./render.js";

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
window.addEventListener("wheel", mousewheel)

const walkSpeed = 10;
const strafeSpeed = 5;
const lookSpeed = 3;
const runMultiplier = 2;

let keys = {};
let messageTimeout;
export let gameStarted = false;
export let wheel = 10;
export let wrongKey;

async function mousewheel(event)
{
    wheel -= event.deltaY / 102;
    wheel = Math.max(Math.min(wheel, 20), 1);
}

async function keydown(event) {
    const keyCode = event.key.toLowerCase();

    //Inventory Controls
    if (keyCode === "enter") {
        await init();
        gameStarted = true;
    }
    else if (keyCode === "arrowup") await nextInventorySlot();
    else if (keyCode === "arrowdown") await previousInventorySlot();
    else if (keyCode === "q") await dropItem();
    //Door Controls
    else if (keyCode === "g") {
        let passable = getClosestPassable();
        if (passable.door.locked) {
            if (await getItemInHand() == null) {
                return;
            }
            getItemInHand().then(async item => {
                await gameClient.doorClient.changeDoorStatus(passable.direction, "unlock", item.name)
                    .then(() => {
                        wrongKey = false;
                        passable.door.locked = false;
                    })
                    .catch(async error => {
                        if (error.message.includes("HTTP-Error: 422")) {
                            wrongKey = true;
                            await setWrongKeyTimeout();
                        } else {
                            console.error("Error unlocking door:", error);
                        }
                    });
            });
        } else {
            await getItemInHand().then(async item => {
                await gameClient.doorClient.changeDoorStatus(passable.direction, "lock", item.name)
                    .then(() => {
                        passable.door.locked = true;
                        wrongKey = false;
                    })
                    .catch(async error => {
                        if (error.message.includes("HTTP-Error: 422")) {
                            wrongKey = true;
                            await setWrongKeyTimeout();
                        } else {
                            console.error("Error unlocking door:", error);
                        }
                    });
            });
        }
    } else if (keyCode === "e") {
        if (closestItem != null) {
            await gameClient.personClient.takeThing(closestItem);
        }

        if (getClosestPassable() == null) {
            return;
        }

        let passable = getClosestPassable();
        if (passable.door.locked) {
            return;
        }
        if (!passable.door.closable) {
            return;
        }
        if (passable.door.open) {
            passable.door.close = true;
            passable.door.open = false;
            await gameClient.doorClient.changeDoorStatus(passable.direction, "close");
        } else {
            passable.door.close = false;
            passable.door.open = true;
            await gameClient.doorClient.changeDoorStatus(passable.direction, "open");
        }
    } else if (keyCode === "f") {
        if (getClosestPassable() == null) {
            return;
        }

        let passable = getClosestPassable();
        if (passable.door.locked) {
            return;
        }
        if (!passable.door.open) {
            return;
        }

        await switchRoom(passable.direction);
    }
    //Regular Controls
    else keys[keyCode] = true;
}

async function keyup(event) {
    keys[event.key.toLowerCase()] = false;
}

export async function updatePlayer() {
    const run = keys["shift"] ? runMultiplier : 1;
    const currentRoom = getCurrentRoom();

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
        if (currentRoom.map[Math.floor(location.playerY) * currentRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX -= Math.sin(location.playerA) * walkSpeed * run * deltaTime;
            location.playerY -= Math.cos(location.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Move backwards
    if (keys["s"]) {
        location.playerX -= Math.sin(location.playerA) * walkSpeed * run * deltaTime;
        location.playerY -= Math.cos(location.playerA) * walkSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(location.playerY) * currentRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX += Math.sin(location.playerA) * walkSpeed * run * deltaTime;
            location.playerY += Math.cos(location.playerA) * walkSpeed * run * deltaTime;
        }
    }

    // Strafe left
    if (keys["a"]) {
        location.playerX -= Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
        location.playerY += Math.sin(location.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(location.playerY) * currentRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX += Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
            location.playerY -= Math.sin(location.playerA) * strafeSpeed * run * deltaTime;
        }
    }

    // Strafe right
    if (keys["d"]) {
        location.playerX += Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
        location.playerY -= Math.sin(location.playerA) * strafeSpeed * run * deltaTime;

        // Collision
        if (currentRoom.map[Math.floor(location.playerY) * currentRoom.mapWidth + Math.floor(location.playerX)] > 0) {
            location.playerX -= Math.cos(location.playerA) * strafeSpeed * run * deltaTime;
            location.playerY += Math.sin(location.playerA) * strafeSpeed * run * deltaTime;
        }
    }

}

async function setWrongKeyTimeout() {
    messageTimeout = setTimeout(() => {
        wrongKey = false;
    }, 1000);
}