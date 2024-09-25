import Player from "./Player.ts";

export default class GameServer {
    serverSocket: any;
    activePlayers: Player[];

    constructor(serverSocket: any) {
        this.serverSocket = serverSocket;
        this.activePlayers = [];
    }

    addPlayer(player: Player) {
        this.activePlayers.push(player);
    }

    removePlayer(player: Player) {
        this.activePlayers = this.activePlayers.filter((p) => p.id !== player.id);
    }

    broadcast(data: string) {
        this.activePlayers.forEach((player) => {
            this.serverSocket.send(data, player.port, '127.0.0.1');
        })
    }
}