import { Socket } from 'socket.io';

export interface SocketExtended extends Socket {
	game_id: string;
	player_id: string;
	player_session: string;
}

export interface TimedPromise extends Promise<any> {
	isCanceled: boolean;
	belongs: string;
	started: Date;
	cancelCompletePromise: () => void;
	cancelRejectPromise: () => void;
}
