import {getTextureById} from "./render.js";
import {gameClient} from "../client/GameClient.js";

const screen = document.getElementById("screen");
const ctx = document.getElementById("screen").getContext("2d");

async function renderInventory()
{
    for (let i = 0; i < 5; i++)
    {
        const texture = await getTextureById(100);
        ctx.drawImage(texture.img, (screen.width / 4) + i * 64, screen.height - 64 - 25);
    }
}

export {renderInventory};