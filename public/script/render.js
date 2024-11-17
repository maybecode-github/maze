import { gameState, firstRoom, depth, fov, steps } from './game.js'; // Importiere gameState statt einzelner Variablen

async function loadTexture(url) {
    const buffer = document.getElementById("buffer");
    const ctx = buffer.getContext("2d");

    const image = new Image();
    image.src = url;
    return new Promise((resolve) => {
        image.addEventListener("load", () => {
            ctx.drawImage(image, 0, 0, image.width, image.height);
            resolve(ctx.getImageData(0, 0, image.width, image.height));
        });
    });
}

async function renderFrame() {
    const screen = document.getElementById("screen");
    const ctx = screen.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);

    for (let x = 0; x < screen.width; x++) {
        let rayAngle = (gameState.playerA - fov / 2.0) + (x / screen.width) * fov;
        let distanceToWall = 0.0;
        let hitWall = false;

        let eyeX = Math.sin(rayAngle);
        let eyeY = Math.cos(rayAngle);

        while (!hitWall && distanceToWall < depth) {
            distanceToWall += steps;

            let testX = Math.floor(gameState.playerX + eyeX * distanceToWall);
            let testY = Math.floor(gameState.playerY + eyeY * distanceToWall);

            // Beam outside of map
            if (testX < 0 || testX >= firstRoom.mapWidth || testY < 0 || testY >= firstRoom.mapHeight) {
                hitWall = true;
                distanceToWall = depth;
            } else {
                if (firstRoom.map[testY * firstRoom.mapWidth + testX] > 0) { // Block
                    hitWall = true;
                }
            }
        }

        const ceiling = Math.round(screen.height / 2.0 - screen.height / distanceToWall);
        const floor = screen.height - ceiling;

        ctx.beginPath();

        // Draw floor
        ctx.moveTo(x, screen.height);
        ctx.lineTo(x, floor);
        let gradient = ctx.createLinearGradient(x, screen.height, x, screen.height / 2);
        gradient.addColorStop(0, "LawnGreen");
        gradient.addColorStop(1, "black");
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // Draw wall
        ctx.moveTo(x, floor);
        ctx.lineTo(x, ceiling);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distanceToWall / depth})`; // Wandfarbe mit Transparenz
        ctx.stroke();
    }
}

export { renderFrame };
