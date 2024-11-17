import {depth, firstRoom, fov, location, steps, wallTexture} from './game.js';
import {getCurrentRoom} from "./player.js";

const screen = document.getElementById("screen");
const ctx = document.getElementById("screen").getContext("2d");

function colorFromName(color) {
    const colors = {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00",
        "darkorchid": "#9932cc",
        "darkred": "#8b0000",
        "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f",
        "darkslateblue": "#483d8b",
        "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1",
        "darkviolet": "#9400d3",
        "deeppink": "#ff1493",
        "deepskyblue": "#00bfff",
        "dimgray": "#696969",
        "dodgerblue": "#1e90ff",
        "firebrick": "#b22222",
        "floralwhite": "#fffaf0",
        "forestgreen": "#228b22",
        "fuchsia": "#ff00ff",
        "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff",
        "gold": "#ffd700",
        "goldenrod": "#daa520",
        "gray": "#808080",
        "green": "#008000",
        "greenyellow": "#adff2f",
        "honeydew": "#f0fff0",
        "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c",
        "indigo": "#4b0082",
        "ivory": "#fffff0",
        "khaki": "#f0e68c",
        "lavender": "#e6e6fa",
        "lavenderblush": "#fff0f5",
        "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd",
        "lightblue": "#add8e6",
        "lightcoral": "#f08080",
        "lightcyan": "#e0ffff",
        "lightgoldenrodyellow": "#fafad2",
        "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90",
        "lightpink": "#ffb6c1",
        "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa",
        "lightskyblue": "#87cefa",
        "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de",
        "lightyellow": "#ffffe0",
        "lime": "#00ff00",
        "limegreen": "#32cd32",
        "linen": "#faf0e6",
        "magenta": "#ff00ff",
        "maroon": "#800000",
        "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd",
        "mediumorchid": "#ba55d3",
        "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371",
        "mediumslateblue": "#7b68ee",
        "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc",
        "mediumvioletred": "#c71585",
        "midnightblue": "#191970",
        "mintcream": "#f5fffa",
        "mistyrose": "#ffe4e1",
        "moccasin": "#ffe4b5",
        "navajowhite": "#ffdead",
        "navy": "#000080",
        "oldlace": "#fdf5e6",
        "olive": "#808000",
        "olivedrab": "#6b8e23",
        "orange": "#ffa500",
        "orangered": "#ff4500",
        "orchid": "#da70d6",
        "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98",
        "paleturquoise": "#afeeee",
        "palevioletred": "#d87093",
        "papayawhip": "#ffefd5",
        "peachpuff": "#ffdab9",
        "peru": "#cd853f",
        "pink": "#ffc0cb",
        "plum": "#dda0dd",
        "powderblue": "#b0e0e6",
        "purple": "#800080",
        "rebeccapurple": "#663399",
        "red": "#ff0000",
        "rosybrown": "#bc8f8f",
        "royalblue": "#4169e1",
        "saddlebrown": "#8b4513",
        "salmon": "#fa8072",
        "sandybrown": "#f4a460",
        "seagreen": "#2e8b57",
        "seashell": "#fff5ee",
        "sienna": "#a0522d",
        "silver": "#c0c0c0",
        "skyblue": "#87ceeb",
        "slateblue": "#6a5acd",
        "slategray": "#708090",
        "snow": "#fffafa",
        "springgreen": "#00ff7f",
        "steelblue": "#4682b4",
        "tan": "#d2b48c",
        "teal": "#008080",
        "thistle": "#d8bfd8",
        "tomato": "#ff6347",
        "turquoise": "#40e0d0",
        "violet": "#ee82ee",
        "wheat": "#f5deb3",
        "white": "#ffffff",
        "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    };

    if (typeof colors[color.toLowerCase()] != 'undefined') {
        let bigint = parseInt(colors[color.toLowerCase()].substring(1, 7), 16);
        return {"r": bigint >> 16 & 255, "g": bigint >> 8 & 255, "b": bigint & 255};
    }

    return false;
}

async function loadTexture(url) {
    const buffer = document.getElementById("buffer");
    const bufferCtx = buffer.getContext("2d");

    const image = new Image();
    image.src = url;
    await image.decode();
    bufferCtx.drawImage(image, 0, 0, image.width, image.height);
    return bufferCtx.getImageData(0, 0, image.width, image.height);
}

async function renderFrame() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, screen.width, screen.height);
    let buffer = ctx.getImageData(0, 0, screen.width, screen.height);

    const floorColor = colorFromName(getColorOfCurrentRoom());

    for (let x = 0; x < screen.width; x++) {
        const rayAngle = (location.playerA - fov / 2.0) + (x / screen.width) * fov;
        let distanceToWall = 0.0;
        let hitWall = false;

        const eyeX = Math.sin(rayAngle);
        const eyeY = Math.cos(rayAngle);
        let sampleX = 0.0;

        while (!hitWall && distanceToWall < depth) {
            distanceToWall += steps;

            const testX = Math.floor(location.playerX + eyeX * distanceToWall);
            const testY = Math.floor(location.playerY + eyeY * distanceToWall);

            // beam outside of map
            if (testX < 0 || testX >= firstRoom.mapWidth || testY < 0 || testY >= firstRoom.mapHeight) {
                hitWall = true;
                distanceToWall = depth;
            } else if (firstRoom.map[testY * firstRoom.mapWidth + testX] > 0) {
                hitWall = true;

                const blockMidX = testX + 0.5;
                const blockMidY = testY + 0.5;

                const testPointX = location.playerX + eyeX * distanceToWall;
                const testPointY = location.playerY + eyeY * distanceToWall;

                const testAngle = Math.atan2(testPointY - blockMidY, testPointX - blockMidX);

                if (testAngle >= -3.14159 * 0.25 && testAngle < 3.14159 * 0.25) {
                    sampleX = testPointY - testY;
                } else if (testAngle >= 3.14159 * 0.25 && testAngle < 3.14159 * 0.75) {
                    sampleX = testPointX - testX;
                } else if (testAngle < -3.14159 * 0.25 && testAngle >= -3.14159 * 0.75) {
                    sampleX = testPointX - testX;
                } else if (testAngle >= 3.14159 * 0.75 || testAngle < -3.14159 * 0.75) {
                    sampleX = testPointY - testY;
                }
            }
        }

        const ceiling = Math.round(screen.height / 2.0 - screen.height / distanceToWall);
        const floor = screen.height - ceiling;

        for (let y = 0; y < screen.height; y++) {
            if (y > ceiling && y <= floor) {
                if (distanceToWall < depth) {
                    let sampleY = (y - ceiling) / (floor - ceiling);
                    const index = (Math.floor(sampleY * wallTexture.height) * wallTexture.width + Math.floor(sampleX * wallTexture.width)) * 4;
                    const fog = 255 * (distanceToWall * 3 / depth);
                    buffer.data[(y * screen.width + x) * 4] = wallTexture.data[index] - fog;
                    buffer.data[(y * screen.width + x) * 4 + 1] = wallTexture.data[index + 1] - fog;
                    buffer.data[(y * screen.width + x) * 4 + 2] = wallTexture.data[index + 2] - fog;
                } else {
                    buffer.data[(y * screen.width + x) * 4] = 0;
                    buffer.data[(y * screen.width + x) * 4 + 1] = 0;
                    buffer.data[(y * screen.width + x) * 4 + 2] = 0;
                }
            } else if (y > floor) {
                let sampleY = (y - screen.height / 2) / screen.height;
                buffer.data[(y * screen.width + x) * 4] = floorColor.r * sampleY;
                buffer.data[(y * screen.width + x) * 4 + 1] = floorColor.g * sampleY;
                buffer.data[(y * screen.width + x) * 4 + 2] = floorColor.b * sampleY;
            }
        }
    }

    ctx.putImageData(buffer, 0, 0);
}

function getColorOfCurrentRoom() {
    if (getCurrentRoom() != null) {
        return getCurrentRoom().color;
    }
    return "white";
}

export {renderFrame, loadTexture};