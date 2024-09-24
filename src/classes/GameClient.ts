import Player from './Player.ts';

class GameClient {
	player: Player;
	socket: any;

	constructor(player: Player, socket: any) {
		this.player = player;
		this.socket = socket;
	}

	sendMove(move: string) {
		const data = {
			id: this.player.id,
			port: this.player.port,
			type: 'move',
			direction: move,
		};
		this.socket.send(JSON.stringify(data));
	}
}
