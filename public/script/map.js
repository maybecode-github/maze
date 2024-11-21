import {location, rooms} from "./game.js";
import {gameClient} from "../client/GameClient.js";
import {getCurrentRoom} from "./player.js";

let mapScale = 5;

function renderMap() {
    const screen = document.getElementById("map");
    const ctx = screen.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    const roomWidth = 11 * mapScale;
    const roomHeight = 11 * mapScale;
    const mapCenterX = screen.width / 2 - (location.playerX - 30) / 11 * roomWidth;
    const mapCenterY = screen.height / 2 - (location.playerY - 30) / 11 * roomHeight;

    rooms.forEach((room) => {
        const roomX = mapCenterX + (room.x - 30) / room.roomSize * roomWidth;
        const roomY = mapCenterY + (room.y - 30) / room.roomSize * roomHeight;

        ctx.fillStyle = room.color;
        ctx.fillRect(roomX - roomWidth / 2, roomY - roomHeight / 2, roomWidth, roomHeight);

        room.passables.forEach((passable) => {
            const doorX = mapCenterX + (passable.x - 31) / (room.roomSize) * roomWidth;
            const doorY = mapCenterY + (passable.y - 31) / (room.roomSize) * roomHeight;
            ctx.fillStyle = passable.door.open ? "green" : passable.door.locked ? "red" : "yellow";
            ctx.fillRect(doorX - roomWidth / 2, doorY - roomHeight / 2, mapScale, mapScale);
        });

        if (room === getCurrentRoom())
        {
            for (let i = 0; i < gameClient.position.things.length; i++)
            {
                const thingX = mapCenterX + (room.x - 31) / room.roomSize * roomWidth;
                const thingY = mapCenterY + (room.y - 31) / room.roomSize * roomHeight;
                let angle = i * (360 / gameClient.position.things.length);
                ctx.fillStyle = "yellow";
                ctx.fillRect(thingX + Math.sin(angle / 180 * 3.14159) * roomWidth / 4, thingY + Math.cos(angle / 180 * 3.14159) * roomWidth / 4, mapScale, mapScale);
            }
        }
    });

    const playerX = mapCenterX + (location.playerX - 30) / 11 * roomWidth;
    const playerY = mapCenterY + (location.playerY - 30) / 11 * roomHeight;
    ctx.arc(playerX - (roomWidth + mapScale * 2) / 2, playerY - (roomHeight + mapScale * 2) / 2, mapScale, 0, 2 * 3.14159);
    ctx.fillStyle = "red";
    ctx.fill();
}

export {renderMap};