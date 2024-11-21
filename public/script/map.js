import {location, rooms} from "./game.js";
import {mapOffsetX, mapOffsetY} from "./controls.js";

function renderMap() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");

    ctx.clearRect(0, 0, screen.width, screen.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, screen.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#2E8B57");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, screen.width, screen.height);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, screen.width, screen.height);

    const scale = 10;
    const mapCenterX = screen.width / 2;
    const mapCenterY = screen.height / 2;

    rooms.forEach(room => {
        const roomWidth = room.roomSize * scale;
        const roomHeight = room.roomSize * scale;

        const x = (room.x - location.playerX) * scale + mapCenterX + mapOffsetX;
        const y = (room.y - location.playerY) * scale + mapCenterY + mapOffsetY;

        ctx.fillStyle = room.color || "#D3D3D3";
        ctx.fillRect(x, y, roomWidth, roomHeight);

        room.passables.forEach(door => {
            const doorX = (door.x - location.playerX) * scale + mapCenterX + mapOffsetX;
            const doorY = (door.y - location.playerY) * scale + mapCenterY + mapOffsetY;
            ctx.fillStyle = "brown"; // door color
            ctx.fillRect(doorX, doorY, scale, scale);
        });
    });

    const playerX = mapCenterX + mapOffsetX;
    const playerY = mapCenterY + mapOffsetY;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(playerX, playerY, scale / 2, 0, 2 * Math.PI);
    ctx.fill();
}

export {renderMap};