export default class Player {
	id: number;
	xPos: number;
	yPos: number;

	constructor(id: number, xPos: number, yPos: number) {
		this.id = id;
		this.xPos = xPos;
		this.yPos = yPos;
	}

	move(x: number, y: number) {
		this.xPos = x;
		this.yPos = y;
	}
}
