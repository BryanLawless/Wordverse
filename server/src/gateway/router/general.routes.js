const events = require("../events");
const ChatHandler = require("../handlers/chat.handler");
const GameHandler = require("../handlers/game.handler");

/* Create a new instance of the GameHandler */
const handler = new GameHandler();

/* Create new instance of ChatHandler */
const chatHandler = new ChatHandler();

/* General events and routes */
module.exports = [
	{
		name: events.CREATE_GAME,
		controller: handler.create
	},
	{
		name: events.PLAYER_JOIN,
		controller: handler.join
	},
	{
		name: events.PLAYER_LEAVE,
		controller: handler.leave
	},
	{
		name: events.START_GAME,
		controller: handler.start
	},
	{
		name: events.SEND_MESSAGE,
		controller: chatHandler.sendMessage
	},
	{
		name: events.JOIN_VOICE,
		controller: chatHandler.joinVoice
	},
	{
		name: events.LEAVE_VOICE,
		controller: chatHandler.leaveVoice
	},
	{
		name: events.DISCONNECT.toLowerCase(),
		controller: handler.disconnect
	}
];
