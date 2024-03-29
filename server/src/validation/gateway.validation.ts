import Joi from 'joi';

const gateway = {
	createGame: Joi.object({
		game_name: Joi.string().min(3).required().messages({
			'string.base': 'Game name should only consist of letters.',
			'string.min': 'Game name should be more than 3 characters.',
			'string.empty': 'Game name cannot be empty.',
			'any.required': 'Game name is required.'
		}),
		players_allowed: Joi.number()
			.integer()
			.greater(1)
			.max(30)
			.required()
			.messages({
				'number.base': 'Game players should only consist of numbers.',
				'number.greater': 'There should be more than 1 player allowed.',
				'number.max': 'The maximum amount of players per game is 30.',
				'number.empty': 'Players allowed should not be empty.',
				'number.integer': 'Players allowed should be a whole number.',
				'any.required': 'Players allowed is required.'
			})
	}),

	joinGame: Joi.object({
		game_id: Joi.string().length(8).required().messages({
			'string.base': 'Game ID should only consist of letters.',
			'string.length': 'Game ID should be 8 characters long.',
			'string.empty': 'Game ID cannot be empty.',
			'any.required': 'Game ID is required.'
		}),
		nickname: Joi.string().trim().min(3).max(20).required().messages({
			'string.base': 'Nickname should only consist of letters.',
			'string.min': 'Nickname should be more than 3 characters.',
			'string.max': 'Nickname should be less than 20 characters.',
			'string.empty': 'Nickname cannot be empty.',
			'any.required': 'Nickname is required.'
		})
	}),

	startGame: Joi.object({
		game_id: Joi.string().length(8).required().messages({
			'string.base': 'Game ID should only consist of letters.',
			'string.length': 'Game ID should be 8 characters long.',
			'string.empty': 'Game ID cannot be empty.',
			'any.required': 'Game ID is required.'
		}),
		game_mode: Joi.string().required().messages({
			'string.base': 'Game mode should only consist of letters.',
			'string.empty': 'Game mode cannot be empty.',
			'any.required': 'Game mode is required.'
		})
	}),

	gameAnswer: Joi.object({
		answer: Joi.string().min(5).max(8).required().messages({
			'string.base': 'Answer should only consist of letters.',
			'string.min': 'Answer should contain at least 5 letters.',
			'string.max': 'Answer should contain at most 8 letters.',
			'string.empty': 'Answer cannot be empty.',
			'any.required': 'An answer is required.'
		})
	}),

	buyPowerup: Joi.object({
		powerup: Joi.string().required().messages({
			'string.base': 'Powerup should only consist of letters.',
			'string.empty': 'Powerup cannot be empty.',
			'any.required': 'A powerup is required.'
		})
	}),

	sendMessage: Joi.object({
		message: Joi.string().trim().min(1).max(256).required().messages({
			'string.base': 'Message should only consist of letters.',
			'string.min': 'Message should be more than 1 character.',
			'string.max': 'Message should be less than 256 characters.',
			'string.empty': 'Message cannot be empty.',
			'any.required': 'A message is required.'
		})
	})
};

export default gateway;
