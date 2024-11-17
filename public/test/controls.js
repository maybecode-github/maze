window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

const walkSpeed = 10;
const strafeSpeed = 5;
const lookSpeed = 3;
const runMultiplier = 2;

let keys = {};

async function keydown(event)
{
	keys[event.key.toLowerCase()] = true;
}

async function keyup(event)
{
	keys[event.key.toLowerCase()] = false;
}

async function updatePlayer()
{
	const run = keys["shift"] ? runMultiplier : 1;

	//look left
	if (keys["arrowleft"])
	{
		playerA -= lookSpeed * deltaTime;
	}

	//look right
	if (keys["arrowright"])
	{
		playerA += lookSpeed * deltaTime;
	}

	//move forward
	if (keys["w"])
	{
		playerX += Math.sin(playerA) * walkSpeed * run * deltaTime;
		playerY += Math.cos(playerA) * walkSpeed * run * deltaTime;

		//move back if collision
		if (currentRoom.map[Math.floor(playerY) * currentRoom.mapWidth + Math.floor(playerX)] > 0)
		{
			playerX -= Math.sin(playerA) * walkSpeed * run * deltaTime;
			playerY -= Math.cos(playerA) * walkSpeed * run * deltaTime;
		}
	}

	//move backwards
	if (keys["s"])
	{
		playerX -= Math.sin(playerA) * walkSpeed * run * deltaTime;
		playerY -= Math.cos(playerA) * walkSpeed * run * deltaTime;

		//move back if collision
		if (currentRoom.map[Math.floor(playerY) * currentRoom.mapWidth + Math.floor(playerX)] > 0)
		{
			playerX += Math.sin(playerA) * walkSpeed * run * deltaTime;
			playerY += Math.cos(playerA) * walkSpeed * run * deltaTime;
		}
	}

	//strafe left
	if (keys["a"])
	{
		playerX -= Math.cos(playerA) * strafeSpeed * run * deltaTime;
		playerY += Math.sin(playerA) * strafeSpeed * run * deltaTime;

		//move back if collision
		if (currentRoom.map[Math.floor(playerY) * currentRoom.mapWidth + Math.floor(playerX)] > 0)
		{
			playerX += Math.cos(playerA) * strafeSpeed * run * deltaTime;
			playerY -= Math.cos(playerA) * strafeSpeed * run * deltaTime;
		}
	}

	//strafe right
	if (keys["d"])
	{
		playerX += Math.cos(playerA) * strafeSpeed * run * deltaTime;
		playerY -= Math.sin(playerA) * strafeSpeed * run * deltaTime;

		//move back if collision
		if (currentRoom.map[Math.floor(playerY) * currentRoom.mapWidth + Math.floor(playerX)] > 0)
		{
			playerX -= Math.cos(playerA) * strafeSpeed * run * deltaTime;
			playerY += Math.sin(playerA) * strafeSpeed * run * deltaTime;
		}
	}
}