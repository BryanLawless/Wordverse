<template>
	<div>
		<Modal
			:show="state.showTurnModal"
			:showClose="false"
			:clickOutsideClose="false"
			@close="state.showTurnModal = false">
			<template #heading>
				<h1 class="text-4xl uppercase font-black mb-5">Your Turn!</h1>
			</template>
			<template #content>
				<div class="flex flex-col gap-2">
					<p>Select a word! You have 10 seconds to choose.</p>
					<div v-for="(word, index) in state.words">
						<Button @click="chooseWord(index)" :text="word" variant="invert" />
					</div>
				</div>
			</template>
		</Modal>
		<div class="flex flex-row mb-3 justify-between">
			<div class="flex flex-row gap-2">
				<Button
					v-if="state.myTurn"
					@click="undo()"
					icon="fa-solid fa-arrow-rotate-left"
					size="icon" />
				<Button
					v-if="state.myTurn"
					@click="clear()"
					icon="fa-solid fa-trash"
					size="icon" />
				<Button @click="save()" icon="fa-solid fa-download" size="icon" />
			</div>
			<div v-if="state.myTurn" class="flex flex-row gap-2 items-center">
				<div class="word-chosen">{{ state.wordChosen }}</div>
			</div>
		</div>
		<div id="canvas-wrapper" class="flex flex-col">
			<Canvas
				:width="state.canvasWidth"
				:height="600"
				:setUndo="(status: boolean) => state.undo = status"
				:setClear="(status: boolean) => state.clear = status"
				:setSave="(status: boolean) => state.save = status"
				:undo="state.undo"
				:clear="state.clear"
				:save="state.save"
				:drawData="state.drawingData"
				:disabled="!state.myTurn"
				@drawing="emitDrawing" />

			<div
				v-if="state.myTurn == false && state.correctGuess == false"
				class="flex flex-row mt-3 gap-2 items-center justify-center">
				<input
					type="text"
					class="input-field guess-field"
					placeholder="Your Guess..."
					@keydown.enter="guessDrawing()"
					v-model="state.guess" />
				<Button
					@click="guessDrawing()"
					type="submit"
					class="guess-button"
					icon="fa-solid fa-check"
					size="icon" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue';
import Canvas from './Canvas.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';

import ws from '@/gateway/websocket';
import { useToast } from 'vue-toastification';

const toast = useToast();

const state = reactive({
	drawingData: {},
	undo: false,
	clear: false,
	save: false,
	myTurn: false,
	guess: '',
	canvasWidth: 0,
	showTurnModal: false,
	words: [],
	wordChosen: '',
	correctGuess: false
});

onMounted(() => {
	state.canvasWidth = document.getElementById('canvas-wrapper')!.scrollWidth;
});

function chooseWord(index: number) {
	ws.emit('CHOOSE_WORD', index);
}

function guessDrawing() {
	ws.emit('GUESS_DRAWING', state.guess);

	state.guess = '';
}

function emitDrawing(data: any) {
	ws.emit('EMIT_DRAWING', data);
}

function undo() {
	state.undo = true;
	ws.emit('UNDO_LINE');
}

function clear() {
	state.clear = true;
	ws.emit('CLEAR_CANVAS');
}

function save() {
	state.save = true;
}

ws.on('TURN_ROTATION', () => (state.correctGuess = false));
ws.on('DRAW_LINE', (data) => (state.drawingData = data));
ws.on('UNDO_LINE', () => (state.undo = true));
ws.on('CLEAR_CANVAS', () => (state.clear = true));
ws.on('POSSIBLE_DRAWING_OPTIONS', (data) => (state.words = data.words));

ws.on('CORRECT_GUESS', () => {
	toast.success('Correct guess!');
	state.correctGuess = true;
});

ws.on('INCORRECT_GUESS', () => {
	toast.error('Incorrect guess!');
});

ws.on('WORD_CHOSEN', (data) => {
	toast.success(`Word chosen: ${data}`);
	state.showTurnModal = false;
	state.wordChosen = data;
});

ws.on('YOUR_TURN', () => {
	state.showTurnModal = true;
	state.myTurn = true;
});

ws.on('END_TURN', () => {
	state.myTurn = false;
});

onBeforeUnmount(() => {
	ws.off('TURN_ROTATION');
	ws.off('DRAW_LINE');
	ws.off('UNDO_LINE');
	ws.off('CLEAR_CANVAS');
	ws.off('POSSIBLE_DRAWING_OPTIONS');
	ws.off('CORRECT_GUESS');
	ws.off('INCORRECT_GUESS');
	ws.off('WORD_CHOSEN');
	ws.off('YOUR_TURN');
	ws.off('END_TURN');
});
</script>

<style lang="css" scoped>
.word-chosen {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background-color: #743ad5;
	padding: 1rem 5rem;
	border-radius: 1rem;
	font-weight: bold;
	font-size: 18px;
	height: 5.5rem;
}
</style>
