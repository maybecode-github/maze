import {getTextureById, getTextureByName} from "./render.js";
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

    for (let i = 0; i < gameClient.person.things.length; i++)
    {
        const texture = await getTextureByName(gameClient.person.things[i].name, 100) ?? await getTextureByName("item-generic", 100);
        ctx.drawImage(texture.img, (screen.width / 4) + i * 64, screen.height - 64 - 33);
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
    if (selected >= gameClient.person.things.length) return;
    await gameClient.positionClient.dropThing(gameClient.person.things[selected].name);
}

export {renderInventory, nextInventorySlot, previousInventorySlot, dropItem};