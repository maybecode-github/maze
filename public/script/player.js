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

export {getCurrentRoom};