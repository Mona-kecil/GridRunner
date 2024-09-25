import GameServer from './classes/GameServer.ts';
import Player from './classes/Player.ts';
import type StandardPacket from './types/standardPacket.ts';

const server = new GameServer(
	await Bun.udpSocket({
		port: 12345,
		socket: {
			data(socket, buf, port, address) {
				let data: StandardPacket = JSON.parse(buf.toString());
				let player = server.getPlayer(data.id);

				if (!player) {
					player = new Player(data.port, data.id, data.xPos, data.yPos);
				}

				if (data.type === 'connect') {
					onClientConnect(player);
					playerTimeout(player);
				} else if (data.type === 'keep-alive') {
					if (player.connected) {
						clearTimeout(player.connected);
					}
					playerTimeout(player);
				} else if (data.type === 'move') {
					const { xPos, yPos } = player;
					switch (data.direction) {
						case 'up':
							player.move(xPos, yPos - 1);
							break;
						case 'down':
							player.move(xPos, yPos + 1);
							break;
						case 'left':
							player.move(xPos - 1, yPos);
							break;
						case 'right':
							player.move(xPos + 1, yPos);
							break;
						default:
							break;
					}
					console.log(`Player ${player.id} -> ${player.getPos()}`);
					data.xPos = player.xPos;
					data.yPos = player.yPos;
					server.broadcast(JSON.stringify(data));
				} else if (data.type === 'kill') {
					clearTimeout(player.connected);
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

// Kick every player on CTRL + C and terminate the server
process.on('SIGINT', () => {
	console.log('Ctrl + C detected, exiting...');
	server.broadcast('kill');
	process.exit();
});
