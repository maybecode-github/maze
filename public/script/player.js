import {location, rooms} from "./game.js";
import {gameClient} from "../client/GameClient.js";
import {generateRoomInDirection} from "./generator.js";
import {setRoomTitle} from "./render.js";

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

    let angle = 0;
    switch (passable.direction)
    {
        case 'e':
            angle = 90;
            break;
        case 'n':
            angle = 180;
            break;
        case 'w':
            angle = 270;
            break;
        default:
            break;
    }

    let playerA = location.playerA / 3.14159 * 180 % 360;
    playerA = (playerA + 360) % 360;
    if (playerA > (angle + 180)) playerA -= 360;
    return distance <= 3 && Math.abs(playerA - angle) < 45;
}

export async function switchRoom(direction) {
    await gameClient.personClient.movePerson(direction);
    gameClient.positionClient.getPosition().then(position => {
        generateRoomInDirection(position, direction);
        setRoomTitle(position.name);
    });
}

export {getCurrentRoom, isNearDoor, getClosestPassable};