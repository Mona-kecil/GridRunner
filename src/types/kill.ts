export default interface Kill {
	id: number;
	port: number;
	type: 'kill';
	reason: 'disconnected';
}
