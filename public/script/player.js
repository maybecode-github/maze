import {location, rooms} from "./game.js";

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
    if(!currentRoom) return null;

    return currentRoom.passables.find(passable => isNearDoor(passable));
}

function isNearDoor(passable) {
    const distance = Math.sqrt(Math.pow(location.playerX - passable.x, 2) +
        Math.pow(location.playerY - passable.y, 2));
    return distance <= 3.5;
}


export {getCurrentRoom, isNearDoor, getClosestPassable};