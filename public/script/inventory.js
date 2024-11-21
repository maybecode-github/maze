import {getTextureById, getTextureByName} from "./render.js";
import {gameClient} from "../client/GameClient.js";

const screen = document.getElementById("screen");
const ctx = document.getElementById("screen").getContext("2d");
let selected = 0;
let slots = 0;

async function renderInventory() {
    slots = gameClient.person.things.length;
    const slot = await getTextureById(100);
    const selectedSlot = await getTextureById(101);

    for (let i = 0; i < slots; i++) {
        ctx.drawImage(i === selected ? selectedSlot.img : slot.img, (i % 10) * 64 + ((10 - Math.min(slots, 10)) * 64) / 2, screen.height - ((Math.floor(i / 10) + 1) * 64) - 35);
    }

    for (let i = 0; i < gameClient.person.things.length; i++) {
        const texture = await getTextureByName(gameClient.person.things[i].name, 100) ?? await getTextureByName("item-generic", 100);
        ctx.drawImage(texture.img, (i % 10) * 64 + ((10 - Math.min(slots, 10)) * 64) / 2, screen.height - 72 - 35);

        if (i === selected)
        {
            ctx.fillStyle = "white";
            ctx.font = "16px Tahoma, serif";
            ctx.textAlign = "center";
            ctx.fillText(gameClient.person.things[i].name, (i % 10) * 64 + ((10 - Math.min(slots, 10) + 1) * 64) / 2, screen.height - 12);
        }
    }
}

async function nextInventorySlot() {
    if (selected < slots - 1) selected++;
}

async function previousInventorySlot() {
    if (selected > 0) selected--;
}

async function getItemInHand() {
    return gameClient.person.things[selected];
}

async function dropItem() {
    if (selected >= gameClient.person.things.length) return;
    await gameClient.positionClient.dropThing(gameClient.person.things[selected].name);
}

export {renderInventory, nextInventorySlot, previousInventorySlot, dropItem, getItemInHand};