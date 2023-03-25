<template>
	<Modal :show="state.showHelpModal" @close="state.showHelpModal = false">
		<template #heading>
			<h1 class="text-4xl uppercase font-black mb-5">How to Play</h1>
		</template>
		<template #content>
			<ul class="text-left font-medium list-disc">
				<li>Create a game and invite your friends with the link.</li>
				<li>Once everybody is in the lobby, click start.</li>
				<li>Each player will get a different scrambled word.</li>
				<li>Unscramble the word to earn medals and a random amount of coins.</li>
				<li>Use the coins you collect for powerups.</li>
				<li>The player with the most medals at the end of the game wins.</li>
				<li>Each game is five minutes long.</li>
			</ul>
		</template>
	</Modal>
	<div class="flex flex-col justify-center gap-4 items-center">
		<Button @click="redirect('join')" text="Play" icon="fa-solid fa-arrow-right" size="large" />
		<Button @click="redirect('create')" text="Create Game" icon="fa-solid fa-plus" size="large" />
		<Button @click="state.showHelpModal = true" text="How To Play" icon="fa-solid fa-question" size="large" />
	</div>
</template>

<script setup>
import { reactive } from "vue";
import Button from "@/components/Button.vue";
import Modal from "@/components/Modal.vue";
import { redirect } from "@/helpers/utility";

const state = reactive({
	showHelpModal: false
});
</script>
