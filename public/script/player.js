import {location, rooms} from "./game.js";
import {gameClient} from "../client/GameClient.js";
import {generateRoomInDirection} from "./generator.js";

let currentRoom;

function getCurrentRoom() {
    for (let room of rooms) {
        if (location.playerX >= room.x && location.playerX <= room.x + 1 + room.roomSize &&
            location.playerY >= room.y && location.playerY <= room.y + 1 + room.roomSize) {
            return room;
        }
    }
    return null; // Return null if no room is found
}

function getClosestPassable() {
    const currentRoom = getCurrentRoom();
    if (!currentRoom) return null;

    return currentRoom.passables.find(passable => isNearDoor(passable));
}

function isNearDoor(passable) {
    const distance = Math.sqrt(Math.pow(location.playerX - passable.x, 2) +
        Math.pow(location.playerY - passable.y, 2));
    return distance <= 2.5;
}

function checkForRoomSwitch() {
    let currentRoom = getCurrentRoom();
    if (getCurrentRoom() !== currentRoom) {
        if (getCurrentRoom() === null) {
            return;
        }
        currentRoom = getCurrentRoom();
    }
}

export function switchRoom(direction) {
    gameClient.personClient.movePerson(direction);
    gameClient.positionClient.getPosition().then(position => {
        generateRoomInDirection(position, direction);
    });
}


export {getCurrentRoom, isNearDoor, getClosestPassable};
setInterval(checkForRoomSwitch, 100);