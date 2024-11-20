import {getTextureById} from "./render.js";
import {gameClient} from "../client/GameClient.js";

const screen = document.getElementById("screen");
const ctx = document.getElementById("screen").getContext("2d");
let selected = 0;

async function renderInventory()
{
    const slot = await getTextureById(100);
    const selectedSlot = await getTextureById(101);

    for (let i = 0; i < 5; i++)
    {
        ctx.drawImage(i === selected ? selectedSlot.img : slot.img, (screen.width / 4) + i * 64, screen.height - 64 - 25);
    }
}

async function nextInventorySlot()
{
    if (selected < 4) selected++;
}

async function previousInventorySlot()
{
    if (selected > 0) selected--;
}

async function dropItem()
{

}

export {renderInventory, nextInventorySlot, previousInventorySlot, dropItem};