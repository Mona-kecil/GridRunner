export default interface StandardPacket {
	id: number;
	port: number;
	xPos: number;
	yPos: number;
	type: 'move' | 'kill' | 'keep-alive' | 'connect';
	direction?: 'up' | 'down' | 'left' | 'right';
}
