import {location, rooms} from "./game.js";

function getCurrentRoom() {
    for (let room of rooms) {
        if (location.playerX >= room.x && location.playerX < room.x + room.roomSize &&
            location.playerY >= room.y && location.playerY < room.y + room.roomSize) {
            return room;
        }
    }
    return null; // Return null if no room is found
}

export {getCurrentRoom};