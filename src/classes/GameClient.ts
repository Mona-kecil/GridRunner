import Player from './Player.ts';
import type StandardPacket from '../types/standardPacket.ts';

export default class GameClient {
	player: Player;
	clientSocket: any;

	constructor(player: Player, clientSocket: any) {
		this.player = player;
		this.clientSocket = clientSocket;
	}

	sendData(type: StandardPacket['type'], direction?: StandardPacket['direction']) {
		if (type === 'move') {
			const data: StandardPacket = {
				id: this.player.id,
				port: this.player.port,
				xPos: this.player.xPos,
				yPos: this.player.yPos,
				type: 'move',
				direction: direction,
			};
			this.clientSocket.send(JSON.stringify(data));
		} else if (type === 'kill') {
			const data: StandardPacket = {
				id: this.player.id,
				port: this.player.port,
				xPos: this.player.xPos,
				yPos: this.player.yPos,
				type: 'kill',
			};
			this.clientSocket.send(JSON.stringify(data));
		} else if (type === 'keep-alive') {
			const data: StandardPacket = {
				id: this.player.id,
				port: this.player.port,
				xPos: this.player.xPos,
				yPos: this.player.yPos,
				type: 'keep-alive',
			};
			this.clientSocket.send(JSON.stringify(data));
		} else if (type === 'connect') {
			const data: StandardPacket = {
				id: this.player.id,
				port: this.player.port,
				xPos: this.player.xPos,
				yPos: this.player.yPos,
				type: 'connect',
			};
			this.clientSocket.send(JSON.stringify(data));
		}
	}

	getPos() {
		console.log(this.player.xPos, this.player.yPos);
	}
}
