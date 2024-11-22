import {location, rooms} from "./game.js";
import {gameClient} from "../client/GameClient.js";
import {getCurrentRoom} from "./player.js";
import {wheel} from "./controls.js";

let lastPlayerA = 0;

function renderMap() {
    const screen = document.getElementById("map");
    const ctx = screen.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    const roomWidth = 11 * wheel;
    const roomHeight = 11 * wheel;
    const mapCenterX = screen.width / 2 - (location.playerX - 37) * roomWidth / 11;
    const mapCenterY = screen.height / 2 - (location.playerY - 37) * roomHeight / 11;

    rooms.forEach((room) => {
        const roomX = mapCenterX + (room.x - 30) / room.roomSize * roomWidth;
        const roomY = mapCenterY + (room.y - 30) / room.roomSize * roomHeight;

        ctx.fillStyle = room.color;
        ctx.fillRect(roomX - roomWidth / 2, roomY - roomHeight / 2, roomWidth, roomHeight);

        room.passables.forEach((passable) => {
            const doorX = mapCenterX + (passable.x - 31) / (room.roomSize) * roomWidth;
            const doorY = mapCenterY + (passable.y - 31) / (room.roomSize) * roomHeight;
            ctx.fillStyle = passable.door.open ? "green" : passable.door.locked ? "red" : "yellow";
            ctx.fillRect(doorX - roomWidth / 2, doorY - roomHeight / 2, wheel, wheel);
        });

        if (room === getCurrentRoom())
        {
            const persons = gameClient.position.persons.filter(person => person.name !== gameClient.person.name);
            for (let i = 0; i < gameClient.position.things.length + persons.length; i++)
            {
                const thingX = mapCenterX + (room.x - 31) / room.roomSize * roomWidth;
                const thingY = mapCenterY + (room.y - 31) / room.roomSize * roomHeight;
                let angle = i * (360 / (gameClient.position.things.length + persons.length));

                if (i < gameClient.position.things.length)
                {
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(thingX + Math.sin(angle / 180 * 3.14159) * roomWidth / 4, thingY + Math.cos(angle / 180 * 3.14159) * roomWidth / 4, wheel, wheel);
                }
                else
                {
                    ctx.fillStyle = "red";
                    ctx.fillRect(thingX + Math.sin(angle / 180 * 3.14159) * roomWidth / 4, thingY + Math.cos(angle / 180 * 3.14159) * roomWidth / 4, wheel, wheel);
                }
            }
        }
    });

    const playerX = mapCenterX + (location.playerX - 30) / 11 * roomWidth;
    const playerY = mapCenterY + (location.playerY - 30) / 11 * roomHeight;
    ctx.arc(playerX - (roomWidth + wheel * 2) / 2, playerY - (roomHeight + wheel * 2) / 2, wheel, 0, 2 * 3.14159);
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.translate(screen.width / 2, screen.height / 2);
    ctx.rotate(location.playerA - lastPlayerA);
    lastPlayerA = location.playerA;
    ctx.translate(-screen.width / 2, -screen.height / 2);
}

export {renderMap};