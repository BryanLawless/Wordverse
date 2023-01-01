<template>
	<GameHeader />
	<div class="container">
		<div class="game-container box-gradient">
			<h2 class="letters-title">Letters: </h2>
			<h1 class="scrambled-letters">{{ state.letters }}</h1>
			<p class="definition">{{ state.definition }}</p>
			<input type="text" class="input-field" placeholder="Answer" v-model="state.answer">
			<div class="game-controls">
				<Button @click="checkWord" text="Check Word" icon="fa-solid fa-check" size="small" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import Button from '@/components/Button.vue';

import ws from '@/gateway/Websocket';
import GameHeader from './GameHeader.vue';

const emit = defineEmits(['gameOver']);

const state = reactive({
	letters: '',
	answer: '',
	definition: '',
});

function checkWord() {
	ws.emit('CHECK_GUESS', {
		answer: state.answer
	});

	state.answer = '';
}

ws.on('GAME_OVER', () => emit('gameOver'));

ws.on('NEW_LETTERS', (data) => {
	state.letters = data.letters;
	state.definition = data.definition;
});
</script>

<style lang="css" scoped>
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