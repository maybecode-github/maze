// Room.js

class Room {
    constructor(x, y, roomSize = 3, doorDirections = []) {
        this.x = x;
        this.y = y;
        this.roomSize = roomSize;
        this.doorDirections = doorDirections;
        this.map = Array(61 * 61).fill(0); // Map mit 61x61 Feldern

        this.createRoom();
    }

    createRoom() {
        // Leere Map setzen (Standard: 0 = leer)
        this.map = Array(61 * 61).fill(0);

        // Wände mit Türen in angegebenen Richtungen setzen
        this.setWalls(this.x, this.y, this.roomSize, this.doorDirections);

        // Spieler immer in der Mitte des Raums platzieren
        playerX = this.x + Math.floor(this.roomSize / 2);
        playerY = this.y + Math.floor(this.roomSize / 2);

        // Wände rendern
        renderWalls();
    }

    setWalls(roomX, roomY, roomSize, doorDirections) {
        const wallSize = roomSize + 2;
        const doorPos = Math.floor(wallSize / 2);

        // Alle Wände setzen
        for (let i = 0; i < wallSize; i++) {
            this.map[(roomY * mapWidth) + roomX + i] = 2; // Nordwand
            this.map[((roomY + wallSize - 1) * mapWidth) + roomX + i] = 2; // Südwand
            this.map[((roomY + i) * mapWidth) + roomX] = 2; // Westwand
            this.map[((roomY + i) * mapWidth) + roomX + wallSize - 1] = 2; // Ostwand
        }

        // Wände für Türen entfernen
        doorDirections.forEach(direction => {
            switch (direction) {
                case 'n':
                    this.map[(roomY * mapWidth) + roomX + doorPos] = 0; // Nordtür
                    break;
                case 's':
                    this.map[((roomY + wallSize - 1) * mapWidth) + roomX + doorPos] = 0; // Südtür
                    break;
                case 'w':
                    this.map[((roomY + doorPos) * mapWidth) + roomX] = 0; // Westtür
                    break;
                case 'e':
                    this.map[((roomY + doorPos) * mapWidth) + roomX + wallSize - 1] = 0; // Osttür
                    break;
                default:
                    console.log("Ungültige Richtung: ", direction);
            }
        });
    }

    // render walls on screen

}
