import {getCurrentRoom} from "./player.js";
import {gameClient} from "../client/GameClient.js";

// standard Blickrichtung süden, nach rechts runter ist Osten
// dann norden, dann westen
export function generateRoomInDirection(direction) {
    let currentRoom = getCurrentRoom();
   // console.log("current room = ", currentRoom);

    let newRoom;
    switch (direction) {
        case 's':
            newRoom = new Room(currentRoom.x, currentRoom.y + currentRoom.roomSize + 1, currentRoom.roomSize);
            //
            break;
        case 'e':
            //
            break;
        case 'n':
            //
            break;
        case 'w':
            //
            break;
        default:
            console.log("Direction not found");
    }
}