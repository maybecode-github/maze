import {getCurrentRoom} from "./player.js";
import {Room} from "../entity/Room.js";
import {location, rooms} from "./game.js";

export function generateRoomInDirection(position, direction) {
    let currentRoom = getCurrentRoom();
    let roomSize = currentRoom.roomSize;
    let newX = currentRoom.x;
    let newY = currentRoom.y;

    switch (direction) {
        case 's':
            newY += roomSize + 2;
            break;
        case 'e':
            newX += roomSize + 2;
            break;
        case 'n':
            newY -= roomSize + 2;
            break;
        case 'w':
            newX -= roomSize + 2;
            break;
        default:
            console.log("Ungültige Richtung: ", direction);
            return null;
    }

    const roomExists = rooms.some(room => room.x === newX && room.y === newY);
    if (roomExists) {
        positionPlayerInCenterOfRoom(newX, newY, roomSize);
        return null;
    }

    const newRoom = new Room(newX, newY, roomSize, position);

    positionPlayerInCenterOfRoom(newX, newY, roomSize);

    return newRoom;
}

function positionPlayerInCenterOfRoom(roomX, roomY, roomSize) {
    location.playerX = roomX + Math.floor(roomSize / 2);
    location.playerY = roomY + Math.floor(roomSize / 2);
}
