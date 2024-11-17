class Room {
    constructor(x, y, roomSize = 3, doorDirections = []) {
        this.mapWidth = 61;
        this.mapHeight = 61;
        this.roomSize = roomSize;
        this.map = Array(this.mapWidth * this.mapHeight).fill(0); // default 0 = empty
        this.createRoom(x, y, doorDirections);
    }

    createRoom(x, y, doorDirections = []) {
        // create empty map with walls and doors
        this.setWalls(x, y, this.roomSize, doorDirections);

        // person in center of the room
        playerX = x + Math.floor(this.roomSize / 2);
        playerY = y + Math.floor(this.roomSize / 2);

        // render walls
        this.renderWalls();
    }

    setWalls(roomX, roomY, roomSize, doorDirections) {
        const wallSize = roomSize + 2;
        const doorPos = Math.floor(wallSize / 2);

        // set all walls
        // north wall
        for (let i = 0; i < wallSize; i++) {
            this.map[(roomY * this.mapWidth) + roomX + i] = 2; // Wand
        }

        // south wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + wallSize - 1) * this.mapWidth) + roomX + i] = 2; // Wand
        }

        // west wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + i) * this.mapWidth) + roomX] = 2; // Wand
        }

        // east wall
        for (let i = 0; i < wallSize; i++) {
            this.map[((roomY + i) * this.mapWidth) + roomX + wallSize - 1] = 2; // Wand
        }

        // remove walls for door positions
        doorDirections.forEach(direction => {
            switch (direction) {
                case 'n':
                    this.map[(roomY * this.mapWidth) + roomX + doorPos] = 0; // Tür nach Norden
                    break;
                case 's':
                    this.map[((roomY + wallSize - 1) * this.mapWidth) + roomX + doorPos] = 0; // Tür nach Süden
                    break;
                case 'w':
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX] = 0; // Tür nach Westen
                    break;
                case 'e':
                    this.map[((roomY + doorPos) * this.mapWidth) + roomX + wallSize - 1] = 0; // Tür nach Osten
                    break;
                default:
                    console.log("Ungültige Richtung: ", direction);
            }
        });
    }

    renderWalls() {
        const screen = document.getElementById("screen");
        const ctx = screen.getContext("2d");
        ctx.fillRect(0, 0, screen.width, screen.height);

        // render walls
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.map[y * this.mapWidth + x] === 2) { // wall block
                    ctx.fillRect(x * 10, y * 10, 10, 10); // draw wall
                } else if (this.map[y * this.mapWidth + x] === 0) { // door (without wall)
                    ctx.fillStyle = "transparent"; // no wall = door
                }
            }
        }
    }
}
