module.exports = {
	/* Game events */
	GET_READY: "GET_READY",
	GAME_OVER: "GAME_OVER",
	GAME_FULL: "GAME_FULL",
	START_GAME: "START_GAME",
	CREATE_GAME: "CREATE_GAME",
	NEW_LETTERS: "NEW_LETTERS",
	CHECK_GUESS: "CHECK_GUESS",
	USE_POWERUP: "USE_POWERUP",
	GAME_CREATED: "GAME_CREATED",
	GAME_REMOVED: "GAME_REMOVED",
	UPDATE_COINS: "UPDATE_COINS",
	UPDATE_SCORE: "UPDATE_SCORE",
	POWERUP_USED: "POWERUP_USED",
	GAME_STARTING: "GAME_STARTING",
	NOT_GAME_HOST: "NOT_GAME_HOST",
	GAME_NOT_FOUND: "GAME_NOT_FOUND",
	GAME_TIMER_SET: "GAME_TIMER_SET",
	CORRECT_GUESS: "CORRECT_GUESS",
	INCORRECT_GUESS: "INCORRECT_GUESS",
	POWERUP_RECEIVED: "POWERUP_RECEIVED",
	INVALID_GAME_MODE: "INVALID_GAME_MODE",
	NOT_ENOUGH_PLAYERS: "NOT_ENOUGH_PLAYERS",
	PLAYERS_BEGIN_GAME: "PLAYERS_BEING_GAME",
	POWERUP_EFFECT_CLEARED: "POWERUP_EFFECT_CLEARED",

	/* Host Events */
	HOST_DISCONNECT: "HOST_DISCONNECT",

	/* Player Events */
	PLAYER_JOIN: "PLAYER_JOIN",
	PLAYER_LEAVE: "PLAYER_LEAVE",
	UPDATE_PLAYER_LIST: "UPDATE_PLAYER_LIST",
	PLAYER_JOIN_SUCCESS: "PLAYER_JOIN_SUCCESS",
	PLAYER_ALREADY_EXISTS: "PLAYER_ALREADY_EXISTS",

	/* Text Chat Events */
	SEND_MESSAGE: "SEND_MESSAGE",
	RECEIVE_MESSAGE: "RECEIVE_MESSAGE",

	/* Voice Chat Events */
	JOIN_VOICE: "JOIN_VOICE",
	LEAVE_VOICE: "LEAVE_VOICE",
	VOICE_TOKEN: "VOICE_TOKEN",
	ADDING_TO_VOICE: "ADDING_TO_VOICE",
	REMOVING_FROM_VOICE: "REMOVING_FROM_VOICE",
	PLAYERS_IN_VOICE: "PLAYERS_IN_VOICE",

	/* Socket Events */
	DISCONNECT: "DISCONNECT",
	ERROR_OCCURRED: "ERROR_OCCURRED",
};
