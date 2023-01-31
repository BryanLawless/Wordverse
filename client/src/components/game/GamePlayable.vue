<template>
	<Freeze v-if="state.effect == 'freeze'" />

	<div class="container">
		<GameSidebar />
		<div class="game-playable-container">
			<div class="game-container box-gradient">
				<h2 class="letters-title">Letters: </h2>
				<h1 class="scrambled-letters">{{ state.letters }}</h1>
				<p class="definition">{{ state.definition }}</p>
				<form @submit.prevent="checkWord" class="guess-inputs">
					<div>
						<input type="text" class="input-field guess-field" placeholder="Answer" v-model="state.answer">
					</div>
					<div><Button type="submit" class="guess-button" text="Check Word" icon="fa-solid fa-check"
							size="small" /></div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from 'vue';
import Freeze from './effects/Freeze.vue';
import GameSidebar from './GameSidebar.vue';
import Button from '@/components/Button.vue';
import { useToast } from 'vue-toastification';

import ws from '@/gateway/Websocket';

const toast = useToast();

const emit = defineEmits(['gameOver']);

const state = reactive({
	letters: '',
	answer: '',
	definition: '',
	effect: ''
});

function checkWord() {
	ws.emit('CHECK_GUESS', {
		answer: state.answer
	});

	state.answer = '';
}

ws.on('GAME_OVER', () => emit('gameOver'));
ws.on('CORRECT_GUESS', () => toast.success('Correct Guess!'));
ws.on('INCORRECT_GUESS', () => toast.error('Incorrect Guess!'));

ws.on('POWERUP_USED', (powerup) => {
	toast(`You used the ${powerup} powerup!`);
});

ws.on('POWERUP_RECIEVED', (powerup) => {
	switch (powerup.name) {
		case 'freeze':
			toast(`You have been frozen for ${powerup.duration / 1000} seconds!`, { timeout: 10000, pauseOnFocusLoss: false });
			state.effect = 'freeze';
			break;
	}
});

ws.on('POWERUP_EFFECT_CLEARED', (effect) => {
	switch (effect) {
		case 'freeze':
			state.effect = '';
			break;
	}
});

ws.on('NEW_LETTERS', (data) => {
	state.letters = data.letters;
	state.definition = data.definition;
});

onBeforeUnmount(() => {
	ws.off('GAME_OVER');
	ws.off('CORRECT_GUESS');
	ws.off('INCORRECT_GUESS');
	ws.off('POWERUP_USED');
	ws.off('POWERUP_RECIEVED');
	ws.off('POWERUP_EFFECT_CLEARED');
	ws.off('NEW_LETTERS');
});
</script>

<style lang="css" scoped>
.container {
	display: flex;
}

.game-playable-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100%;
	gap: 3.5rem;
	position: relative;
}

.game-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	border-radius: 1rem;
	width: 35rem;
}

.guess-inputs {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
}

.letters-title {
	font-size: 2rem;
}

.scrambled-letters {
	color: #fff;
	font-size: 4rem;
	text-shadow: #FEFB75 1px 0 10px;
}

.definition {
	font-size: 1rem;
	font-style: italic;
	text-align: center;
}
</style>