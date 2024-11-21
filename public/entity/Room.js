import {location, rooms} from "../script/game.js";
import {gameClient} from "../client/GameClient.js";
import {Passable} from "./Passable.js";

class Room {

    constructor(x, y, roomSize = 3, position) {
        this.x = x;
        this.y = y;
        this.position = position;
        this.doorDirections = position.directions;
        this.mapWidth = 61;
        this.mapHeight = 61;
        this.roomSize = roomSize;
        this.color = position.color;
        this.passables = [];
        this.map = Array(this.mapWidth * this.mapHeight).fill(0); // default 0 = empty

        // add room to rooms array
        rooms.push(this);

        // create all available rooms
        rooms.forEach(room => {
            room.createRoom(this.x, this.y, this.doorDirections);
        });
    }

    createRoom(x, y, doorDirections = []) {
        // create empty map with walls and doors
        this.setWalls(x, y, this.roomSize, doorDirections);

        // person in center of the room
        location.playerX = x + Math.floor(this.roomSize / 2);
        location.playerY = y + Math.floor(this.roomSize / 2);
    }

    setWalls(roomX, roomY, roomSize, doorDirections) {
        const wallSize = roomSize + 2;
        const doorPos = Math.floor(wallSize / 2);

        this.map[((roomY + Math.ceil(roomSize / 2)) * this.mapWidth) + roomX + Math.ceil(roomSize / 2)] = 1;

        // set all walls
        // north wall
        for (let i = 0; i < wallSize; i++) {
            this.map[(roomY * this.mapWidth) + roomX + i] = 1; // wall
        }

        // south wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + wallSize - 1) * this.mapWidth) + roomX + i] = 1; // wall
        }

        // west wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + i) * this.mapWidth) + roomX] = 1; // wall
        }

        // east wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + i) * this.mapWidth) + roomX + wallSize - 1] = 1; // wall
        }

        // remove walls for door positions
        doorDirections.forEach(direction => {
            switch (direction) {
                case 'n':
                    const northDoorX = roomX + doorPos;
                    const northDoorY = roomY;
                    this.map[(roomY * this.mapWidth) + roomX + doorPos] = 11; // north door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('n'), northDoorX, northDoorY, 'n', this));
                    break;
                case 's':
                    const southDoorX = roomX + doorPos;
                    const southDoorY = roomY + wallSize - 1;
                    this.map[((roomY + wallSize - 1) * this.mapWidth) + roomX + doorPos] = 11; // south door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('s'), southDoorX, southDoorY, 's', this));
                    break;
                case 'w':
                    const westDoorX = roomX;
                    const westDoorY = roomY + doorPos;
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX] = 11; // west door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('w'), westDoorX, westDoorY, 'w', this));
                    break;
                case 'e':
                    const eastDoorX = roomX + wallSize - 1;
                    const eastDoorY = roomY + doorPos;
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX + wallSize - 1] = 11; // east door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('e'), eastDoorX, eastDoorY, 'e', this));
                    break;
            }
        });
    }
}

export {Room};
