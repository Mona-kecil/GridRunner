import GameServer from './classes/GameServer.ts';
import Player from './classes/Player.ts';

const server = new GameServer(
	Bun.udpSocket({
		port: 12345,
		socket: {
			data(socket, buf, port, address) {
				const data = JSON.parse(buf.toString());
				const player = new Player(data.port, data.id, 0, 0);

				if (data.type === 'connect') {
					onClientConnect(player);
					playerTimeout(player);
				} else if (data.type === 'keep-alive') {
					clearTimeout(player.connected);
					playerTimeout(player);
				} else if (data.type === 'move') {
					const x = player.xPos;
					const y = player.yPos;

					switch (data.direction) {
						case 'up':
							player.move(x, y - 1);
							break;
						case 'down':
							player.move(x, y + 1);
							break;
						case 'left':
							player.move(x - 1, y);
							break;
						case 'right':
							player.move(x + 1, y);
							break;
						default:
							break;
                        }
				} else if (data.type === 'kill') {
					onClientDisconnect(player);
				} else {
					console.log(
						`Invalid message type from ${player.id} on ${player.port}`
					);
				}
			},
		},
	})
);

function onClientConnect(player: Player) {
	console.log('New client connected!');
	console.log(`Player ${player.id} connected from ${player.port}`);
	server.addPlayer(player);
}

// Client either no longer sending keep-alive messages or sent a kill message
function onClientDisconnect(player: Player) {
	console.log(`Player ${player.id} from ${player.port} disconnected`);
	server.removePlayer(player);
}

function playerTimeout(player: Player) {
	player.connected = setTimeout(() => {
		onClientDisconnect(player);
	}, 3000);
}
