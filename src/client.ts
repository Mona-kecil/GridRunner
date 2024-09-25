import GameClient from './classes/GameClient';
import Player from './classes/Player';
import type StandardPacket from './types/standardPacket';

const socket = await Bun.udpSocket({
	connect: {
		port: 12345,
		hostname: '127.0.0.1',
	},
	socket: {
		data(socket, buf, port, address) {
			const data: StandardPacket = JSON.parse(buf.toString());
			if (data.type === 'move') {
				updatePlayerPosition(data.xPos, data.yPos);
				if (data.id === client.player.id) {
					console.log(`Dir: ${data.direction} Pos: ${client.player.getPos()}`);
				} else {
					console.log(`Player ${data.id} moved to ${data.xPos}, ${data.yPos}`);
				}
			} else if (data.type === 'kill') {
				console.log(`You are kicked from the server.`);
				process.exit();
			} else {
				console.log(`Invalid message type from ${data.id} on ${data.port}`);
			}
		},
	},
});

const player = new Player(
	socket.port,
	socket.port + Math.floor(Math.random() * 100),
	0,
	0
);

console.log(`Player ${player.id} connected from ${player.port}`);

const client = new GameClient(player, socket);
client.sendData('connect');

function updatePlayerPosition(x: number, y: number) {
	player.xPos = x;
	player.yPos = y;
}

// Listen to CTRL + C
process.on('SIGINT', () => {
	console.log('Ctrl + C detected, exiting...');
	client.sendData('kill');
	process.exit();
});

// Keep sending keep-alive messages
setInterval(() => {
	try {
		client.sendData('keep-alive');
	} catch (error) {
		console.log('\nServer dies, exiting...');
		process.exit();
	}
}, 1000);

// Listen for player input
process.stdout.write(`[W A S D] to move, or [CTRL + C] to quit: `);
for await (const line of console) {
	switch (line) {
		case 'w' || 'W':
			client.sendData('move', 'up');
			break;
		case 'a' || 'A':
			client.sendData('move', 'left');
			break;
		case 's' || 'S':
			client.sendData('move', 'down');
			break;
		case 'd' || 'D':
			client.sendData('move', 'right');
			break;
		case 'c' || 'C':
			client.sendData('kill');
			process.exit();
			break;
		default:
	}
}
