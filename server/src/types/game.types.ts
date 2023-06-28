import { TimedPromise } from '../types/extend.types.js';

export interface GameFound {
	index: number;
	game: Game;
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
	lines: Array<Line>;
	round: number;
	currentTurn: number;
	timers: Array<TimedPromise>;
}

export interface Powerup {
	name: string;
	duration: number;
	coins: number;
	target: string;
}

export interface PlayerCount {
	current: number;
	allowed: number;
}

export interface Line {
	x0: number;
	y0: number;
	x1: number;
	y1: number;
	c: string;
	l: number;
}

export type Powerups = Array<Powerup>;
