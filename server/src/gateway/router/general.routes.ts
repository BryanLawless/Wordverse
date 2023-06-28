import ChatHandler from '../handlers/chat.handler.js';
import GameHandler from '../handlers/game.handler.js';
import {
	CREATE_GAME,
	PLAYER_JOIN,
	PLAYER_LEAVE,
	START_GAME,
	SEND_MESSAGE,
	JOIN_VOICE,
	LEAVE_VOICE,
	DISCONNECT
} from '../events.js';

/* General events and routes */
export default [
	{
		name: CREATE_GAME,
		controller: GameHandler.create
	},
	{
		name: PLAYER_JOIN,
		controller: GameHandler.join
	},
	{
		name: PLAYER_LEAVE,
		controller: GameHandler.leave
	},
	{
		name: START_GAME,
		controller: GameHandler.start
	},
	{
		name: SEND_MESSAGE,
		controller: ChatHandler.sendMessage
	},
	{
		name: JOIN_VOICE,
		controller: ChatHandler.joinVoice
	},
	{
		name: LEAVE_VOICE,
		controller: ChatHandler.leaveVoice
	},
	{
		name: DISCONNECT.toLowerCase(),
		controller: GameHandler.leave
	}
];
