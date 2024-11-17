window.onload = function() {
    update(["Blume", "Schlüssel"]);
}

function update(things)
{
    const inventory = document.getElementById("inventory");

    for (let i = 0; i < things.length; i++)
    {
        inventory.innerHTML += `<p>${things[i]}</p>`;
    }
}