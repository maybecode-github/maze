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
        this.createRoom(this.x, this.y, this.doorDirections);
        rooms.push(this);
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

        if (doorDirections.length > 2)
        {
            //wall in the middle
            this.map[((roomY + Math.ceil(roomSize / 2)) * this.mapWidth) + roomX + Math.ceil(roomSize / 2)] = 1;
        }

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
        doorDirections.forEach(async direction => {
            await this.updateDoor(direction, true);
        });
    }

    async updateDoor(direction, createPassables)
    {
        console.log(this);
        const wallSize = this.roomSize + 2;
        const doorPos = Math.floor(wallSize / 2);
        let door = await gameClient.doorClient.getDoor(direction);
        let doorIndex = door.open ? 10 : door.locked ? 12 : 11;

        let oldDoorIndex = null;
        if (this.passables != null && this.passables.length > 0) {
            for (let i = 0; i < this.passables.length; i++) {
                if (this.passables[i].direction === direction) oldDoorIndex = i;
            }
        }

        console.log(oldDoorIndex);

        switch (direction) {
            case 'n':
                const northDoorX = this.x + doorPos;
                const northDoorY = this.y;
                this.map[(this.y * this.mapWidth) + this.x + doorPos] = doorIndex; // north door
                if (createPassables === true && oldDoorIndex == null) this.passables.push(new Passable(door, northDoorX, northDoorY, 'n', this));
                else this.passables[oldDoorIndex].door = door;
                break;
            case 's':
                const southDoorX = this.x + doorPos;
                const southDoorY = this.x + wallSize - 1;
                this.map[((this.y + wallSize - 1) * this.mapWidth) + this.x + doorPos] = doorIndex; // south door
                if (createPassables === true && oldDoorIndex == null) this.passables.push(new Passable(door, southDoorX, southDoorY, 's', this));
                else this.passables[oldDoorIndex].door = door;
                break;
            case 'w':
                const westDoorX = this.x;
                const westDoorY = this.x + doorPos;
                this.map[((this.y + doorPos) * this.mapWidth) + this.x] = doorIndex; // west door
                if (createPassables === true && oldDoorIndex == null) this.passables.push(new Passable(door, westDoorX, westDoorY, 'w', this));
                else this.passables[oldDoorIndex].door = door;
                break;
            case 'e':
                const eastDoorX = this.x + wallSize - 1;
                const eastDoorY = this.x + doorPos;
                this.map[((this.y + doorPos) * this.mapWidth) + this.x + wallSize - 1] = doorIndex; // east door
                if (createPassables === true && oldDoorIndex == null) this.passables.push(new Passable(door, eastDoorX, eastDoorY, 'e', this));
                else this.passables[oldDoorIndex].door = door;
                break;
        }
    }
}

export {Room};
