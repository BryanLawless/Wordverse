<template>
	<Modal :show="state.showHelpModal" @close="state.showHelpModal = false">
		<template #heading>
			<h1 class="text-4xl uppercase font-black mb-5">How to Play</h1>
		</template>
		<template #content>
			<div class="flex flex-col gap-2">
				<div class="tab-container">
					<button @click="openTab($event, 'game')" class="tablinks active">
						Create a Game
					</button>
					<button @click="openTab($event, 'scramble')" class="tablinks">
						Scramble
					</button>
					<button @click="openTab($event, 'pictionary')" class="tablinks">
						Pictionary
					</button>
				</div>
				<div class="tab-content invisible-scrollbar" id="game" style="display: block">
					<ul class="text-left font-medium list-disc">
						<li>Click "Create Game".</li>
						<li>Set your preferred game name and player count.</li>
						<li>Once you are in the lobby, copy the link and invite your friends</li>
						<li>Once everyone is in, you can start playing any game mode.</li>
					</ul>
				</div>
				<div class="tab-content invisible-scrollbar" id="scramble">
					<ul class="text-left font-medium list-disc">
						<li>Each player will get a different scrambled words.</li>
						<li>Unscramble each word to increase your score and receive a random amount of coins.</li>
						<li>Use the coins you collect for power-ups to hinder other players progress.</li>
						<li>The player with the highest score at the end of the game wins.</li>
						<li>Each game is five minutes long.</li>
					</ul>
				</div>
				<div class="tab-content invisible-scrollbar" id="pictionary">
					<ul class="text-left font-medium list-disc">
						<li>The first player in the lobby will be able to draw first.</li>
						<li>The player that is drawing can choose a word to draw from a choice of three words.</li>
						<li>Use the drawing canvas and colors to draw the word to the best of your ability.</li>
						<li>Other players will try to guess the word based on your drawing.</li>
						<li>If a player gets the word right, they will receive points based on how fast they guessed the
							correct word.</li>
						<li>The player that is drawing will also get points based on how fast the player was able to guess
							the word
							correctly.</li>
						<li>The next player will get to draw.</li>
						<li>Each game is five rounds, a round is counted after all players have had a turn.
						</li>
					</ul>
				</div>
			</div>
		</template>
	</Modal>
	<div class="flex flex-col justify-center gap-4 items-center">
		<Button @click="redirect('join')" text="Play" icon="fa-solid fa-arrow-right" size="large" />
		<Button @click="redirect('create')" text="Create Game" icon="fa-solid fa-plus" size="large" />
		<Button @click="state.showHelpModal = true" text="How To Play" icon="fa-solid fa-question" size="large" />
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import { redirect, openTab } from '@/helpers/utility.js';

const state = reactive({
	showHelpModal: false
});
</script>
