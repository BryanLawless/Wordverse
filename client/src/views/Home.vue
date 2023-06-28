<template>
	<Modal :show="state.showHelpModal" @close="state.showHelpModal = false">
		<template #heading>
			<h1 class="text-4xl uppercase font-black mb-5">How to Play</h1>
		</template>
		<template #content>
			<p>Create a game and invite your friends with the link.</p>
			<p>
				Once everybody is in the lobby and a game mode has been selected, click
				start.
			</p>
			<p id="paragraph">Well crap</p>
			<button @click="ChangeScreen()">></button>
			<button @click="ChangePage()">>></button>
		</template>
	</Modal>
	<div class="flex flex-col justify-center gap-4 items-center">
		<Button
			@click="redirect('join')"
			text="Play"
			icon="fa-solid fa-arrow-right"
			size="large" />
		<Button
			@click="redirect('create')"
			text="Create Game"
			icon="fa-solid fa-plus"
			size="large" />
		<Button
			@click="state.showHelpModal = true"
			text="How To Play"
			icon="fa-solid fa-question"
			size="large" />
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { redirect } from '@/helpers/utility';

const state = reactive({
	showHelpModal: false
});

var pageId = 0;
var screenId = 0;
var Tutorial = document.getElementById('paragraph');

function ChangePage() {
	if (pageId == 1) {
		pageId = 0;
		screenId = 0;
		ChangeScreen();
	} else {
		pageId = 1;
		screenId = 0;
		ChangeScreen();
	}
}

function ChangeScreen() {
	switch (pageId) {
		case 0:
			switch (screenId) {
				case 0:
					Tutorial!.innerHTML =
						'In our SCRAMBLE game mode, each player will get a different scrambled word.';
					screenId++;
					break;
				case 1:
					Tutorial!.innerHTML =
						'Unscramble the word to earn medals and a random amount of coins.';
					screenId++;
					break;
				case 2:
					Tutorial!.innerHTML = 'Use the coins you collect for powerups.';
					screenId++;
					break;
				case 3:
					Tutorial!.innerHTML =
						'The player with the most medals at the end of the game wins.';
					screenId++;
					break;
				case 4:
					Tutorial!.innerHTML = 'Each game is five minutes long.';
					screenId = 0;
					break;
			}
			break;
		case 1:
			switch (screenId) {
				case 0:
					Tutorial!.innerHTML =
						"In our PICTIONARY game mode, one player is assigned to be the 'drawer'.";
					screenId++;
					break;
				case 1:
					Tutorial!.innerHTML =
						'This player has 10 seconds to select one of three words, and then must try to draw the selected word in 60 seconds or less.';
					screenId++;
					break;
				case 2:
					Tutorial!.innerHTML =
						'Everybody else must try to guess the word based on the drawing, within those 60 seconds.';
					screenId++;
					break;
				case 3:
					Tutorial!.innerHTML =
						'Once everybody has guessed or the time runs out, the next player will be selected to draw.';
					screenId++;
					break;
				case 4:
					Tutorial!.innerHTML =
						'There are 5 rounds, each rotating through all players once.';
					screenId = 0;
					break;
			}
			break;
	}
}
</script>
