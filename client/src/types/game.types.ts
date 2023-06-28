export interface LeaderboardPlayer {
	nickname: string;
	score: number;
}

export interface Game {
	game_id: string;
	game_name: string;
	host_socket: string;
	started: boolean;
	mode: string;
	player_count: number;
	players_allowed: number;
	players_in_voice: Array<string>;
}

export interface Player {
	player_socket_id: string;
	nickname: string;
	game_id: string;
	score: number;
	coins: number;
	effects: string[];
}
