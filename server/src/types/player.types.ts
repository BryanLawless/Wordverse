export interface PlayerFound {
	index: number;
	player: Player;
}

export interface Player {
	player_socket: string;
	nickname: string;
	game_id: string;
	answer: string;
	score: number;
	coins: number;
	effects: Array<String>;
	turn: boolean;
	choosing: boolean;
	correct_guess: boolean;
}

export interface Effect {
	name: string;
	duration: number;
	coins: number;
	target: string;
}
