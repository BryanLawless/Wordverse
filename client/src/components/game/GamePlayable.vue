<template>
	<Freeze v-if="state.effect == 'freeze'" />
	<GameHeader />
	<GameStore v-if="state.storeOpen" @backToGame="state.storeOpen = false" />
	<div v-if="!state.storeOpen" class="game-playable-container">
		<div class="game-container box-gradient">
			<h2 class="letters-title">Letters: </h2>
			<h1 class="scrambled-letters">{{ state.letters }}</h1>
			<p class="definition">{{ state.definition }}</p>
			<input type="text" class="input-field" placeholder="Answer" v-model="state.answer">
			<div class="game-controls">
				<Button @click="state.storeOpen = true" text="Store" icon="fa-solid fa-store" small="small" />
				<Button @click="checkWord" text="Check Word" icon="fa-solid fa-check" small="small" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from 'vue';
import GameStore from './GameStore.vue';
import Freeze from './effects/Freeze.vue';
import Button from '@/components/Button.vue';
import { useToast } from 'vue-toastification';

import ws from '@/gateway/Websocket';
import GameHeader from './GameHeader.vue';

const toast = useToast();

const emit = defineEmits(['gameOver']);

const state = reactive({
	letters: '',
	answer: '',
	definition: '',
	effect: '',
	storeOpen: false
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
})

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
.game-playable-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
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
	width: 30rem;
}

.game-controls {
	display: flex;
	flex-direction: row;
	gap: 1rem;
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