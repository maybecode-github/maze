import {getCurrentRoom} from "./player.js";
import {Room} from "../entity/Room.js";
import {location, rooms} from "./game.js";

export function generateRoomInDirection(position, direction) {
    let currentRoom = getCurrentRoom();
    let roomSize = currentRoom.roomSize;
    let newX = currentRoom.x;
    let newY = currentRoom.y;
    let newDoorDirections = [];

    switch (direction) {
        case 's': // south
            newY += roomSize + 1;
            newDoorDirections = ['n'];
            break;
        case 'e': // east
            newX += roomSize + 1;
            newDoorDirections = ['w'];
            break;
        case 'n': // north
            newY -= roomSize + 1;
            newDoorDirections = ['s'];
            break;
        case 'w': // west
            newX -= roomSize + 1;
            newDoorDirections = ['e'];
            break;
        default:
            console.log("Ungültige Richtung: ", direction);
            return null;
    }

    const roomExists = rooms.some(room => room.x === newX && room.y === newY);
    if (roomExists) {
        location.playerX = newX + Math.floor(roomSize / 2);
        location.playerY = newY + Math.floor(roomSize / 2);
        console.log("Ein Raum existiert bereits an dieser Position.");
        return null;
    }

    // Berechnung der Türen unter Berücksichtigung der Rückverlinkung
    const oppositeDirection = getOppositeDirection(direction);
    const doors = [...newDoorDirections, oppositeDirection];

    // Neuen Raum erstellen
    const newRoom = new Room(newX, newY, roomSize, position);

    console.log("Neuer Raum generiert: ", newRoom);
    return newRoom;
}

// Hilfsfunktion zur Bestimmung der entgegengesetzten Richtung
function getOppositeDirection(direction) {
    switch (direction) {
        case 'n':
            return 's';
        case 's':
            return 'n';
        case 'e':
            return 'w';
        case 'w':
            return 'e';
        default:
            return null;
    }
}
