async function loadTexture(url)
{
	const buffer = document.getElementById("buffer");
	const ctx = buffer.getContext("2d");
	
	const image = new Image();
	image.src = url;
	image.addEventListener("load", () => {
		ctx.drawImage(image, 0, 0, image.width, image.height);
		return ctx.getImageData(0, 0, image.width, image.height);
	})
}

async function renderFrame()
{
	const screen = document.getElementById("screen");
	const ctx = screen.getContext("2d");
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, screen.width, screen.height);
	
	for (let x = 0; x < screen.width; x++)
	{
		let rayAngle = (playerA - fov / 2.0) + (x / screen.width) * fov;
		let distanceToWall = 0.0;
		let hitWall = false;
		
		let eyeX = Math.sin(rayAngle);
		let eyeY = Math.cos(rayAngle);
		
		while (!hitWall && distanceToWall < depth)
		{
			distanceToWall += steps;
			
			let testX = Math.floor(playerX + eyeX * distanceToWall);
			let testY = Math.floor(playerY + eyeY * distanceToWall);

			// beam outside of map
			if (testX < 0 || testX >= currentRoom.mapWidth || testY < 0 || testY >= currentRoom.mapHeight) {
				hitWall = true;
				distanceToWall = depth;
			} else {
				if (currentRoom.map[testY * currentRoom.mapWidth + testX] > 0) { // Block
					hitWall = true;
				}
			}
		}
		
		const ceiling = Math.round(screen.height / 2.0 - screen.height / distanceToWall);
		const floor = screen.height - ceiling;
		
		ctx.beginPath();

		ctx.moveTo(x, screen.height);
		ctx.lineTo(x, floor);
		let gradient = ctx.createLinearGradient(x, screen.height, x, screen.height / 2);
		gradient.addColorStop(0, "LawnGreen");
		gradient.addColorStop(1, "black");
		ctx.strokeStyle = gradient;
		ctx.stroke();
		
		ctx.moveTo(x, floor);
		ctx.lineTo(x, ceiling);
		ctx.strokeStyle = `rgb(from white r g b / ${100 - distanceToWall * 8}%)`;
		ctx.stroke();
	}
}