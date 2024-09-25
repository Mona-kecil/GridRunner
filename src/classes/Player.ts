export default class Player {
	port: number;
	id: number;
	xPos: number;
	yPos: number;
	connected?: Timer;

	constructor(port: number, id: number, xPos: number, yPos: number) {
		this.port = port;
		this.id = id;
		this.xPos = xPos;
		this.yPos = yPos;
	}

	move(x: number, y: number) {
		this.xPos = x;
		this.yPos = y;
	}

	getPos() {
		return `${this.xPos},${this.yPos}`;
	}
}
