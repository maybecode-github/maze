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

        // render walls
        this.renderWalls();
    }

    setWalls(roomX, roomY, roomSize, doorDirections) {
        const wallSize = roomSize + 2;
        const doorPos = Math.floor(wallSize / 2);

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
                    this.map[(roomY * this.mapWidth) + roomX + doorPos] = 0; // north door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('n'), northDoorX, northDoorY, 'n'));
                    console.log("DOOR WAS PUSHED");
                    break;
                case 's':
                    const southDoorX = roomX + doorPos;
                    const southDoorY = roomY + wallSize - 1;
                    this.map[((roomY + wallSize - 1) * this.mapWidth) + roomX + doorPos] = 0; // south door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('s'), southDoorX, southDoorY, 's'));
                    break;
                case 'w':
                    const westDoorX = roomX;
                    const westDoorY = roomY + doorPos;
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX] = 0; // west door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('w'), westDoorX, westDoorY, 'w'));
                    break;
                case 'e':
                    const eastDoorX = roomX + wallSize - 1;
                    const eastDoorY = roomY + doorPos;
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX + wallSize - 1] = 0; // east door
                    this.passables.push(new Passable(gameClient.doorClient.getDoor('e'), eastDoorX, eastDoorY, 'e'));
                    break;
            }
        });
    }

    /**
     * method to generate map from top view
     */
    renderWalls() {
        /*const screen = document.getElementById("screen");
        const ctx = screen.getContext("2d");
        ctx.fillRect(0, 0, screen.width, screen.height);

        // render walls
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map[y * this.mapWidth + x] === 2) { // wall block
                    ctx.fillStyle = this.color; // wall color
                    ctx.fillRect(x * 10, y * 10, 10, 10); // draw wall
                } else if (this.map[y * this.mapWidth + x] === 0) { // door (without wall)
                    ctx.fillStyle = "transparent"; // no wall = door
                }
            }
        }*/
    }
}

export {Room};
