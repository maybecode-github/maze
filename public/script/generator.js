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

    let deltaX = Math.sign(currentRoom.x - newX);
    let deltaY = Math.sign(currentRoom.y - newY);

    const roomExists = rooms.some(room => room.x === newX && room.y === newY);
    if (roomExists) {
        positionPlayerInCenterOfRoom(newX, newY, roomSize, deltaX * 3, deltaY * 3);
        return null;
    }

    const newRoom = new Room(newX, newY, roomSize, position);
    positionPlayerInCenterOfRoom(newX, newY, roomSize, deltaX * 3, deltaY * 3);
    return newRoom;
}

export function positionPlayerInCenterOfRoom(roomX, roomY, roomSize, deltaX, deltaY) {
    location.playerX = roomX + 1 + deltaX + (roomSize / 2);
    location.playerY = roomY + 1 + deltaY + (roomSize / 2);
    location.playerA = Math.atan2(-deltaX, -deltaY);
    console.log(Math.atan2(deltaY, deltaX) / 3.14159 * 180);
}
