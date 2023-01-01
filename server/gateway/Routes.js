const events = require('./Events');
const GameHandler = require('./handlers/Game.handler');

const handler = new GameHandler();

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
		name: events.DISCONNECT.toLowerCase(),
		controller: handler.disconnect
	},
]