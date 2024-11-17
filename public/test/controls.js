window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const moveSpeed = 10;
const lookSpeed = 3;

async function keydown(event)
{
	keys[event.key] = true;
}

async function keyup(event)
{
	keys[event.key] = false;
}

async function updatePlayer()
{
	//look around
	if (keys["ArrowLeft"])
	{
		playerA -= lookSpeed * deltaTime;
	}

	if (keys["ArrowRight"])
	{
		playerA += lookSpeed * deltaTime;
	}

	//move
	if (keys["d"] || keys["D"])
	{
		playerX += Math.sin(playerA + 90) * moveSpeed * deltaTime;
		playerY += Math.cos(playerA + 90) * moveSpeed * deltaTime;
	}

	if (keys["A"] || keys["a"])
	{
		playerX += Math.sin(playerA - 90) * moveSpeed * deltaTime;
		playerY += Math.cos(playerA - 90) * moveSpeed * deltaTime;
	}

	if (keys["W"] || keys["w"])
	{
		playerX += Math.sin(playerA) * moveSpeed * deltaTime;
		playerY += Math.cos(playerA) * moveSpeed * deltaTime;
	}

	if (keys["S"] || keys["s"])
	{
		playerX -= Math.sin(playerA) * moveSpeed * deltaTime;
		playerY -= Math.cos(playerA) * moveSpeed * deltaTime;
	}
}