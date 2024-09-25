import Player from './Player.ts';

export default class GameClient {
	player: Player;
	clientSocket: any;

	constructor(player: Player, clientSocket: any) {
		this.player = player;
		this.clientSocket = clientSocket;
	}

	sendMove(move: string) {
		const data = {
			id: this.player.id,
			port: this.player.port,
			type: 'move',
			direction: move,
		};
		this.clientSocket.send(JSON.stringify(data));
	}
}
