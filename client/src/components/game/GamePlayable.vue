<template>
	<Freeze v-if="state.effect == 'freeze'" />
	<div class="flex">
		<GameSidebar @joinVoice="emit('joinVoice')" @leaveVoice="emit('leaveVoice')" />
		<div class="flex flex-col items-center justify-center gap-14 w-full h-screen">
			<div class="game-container">
				<h2 class="leading-none font-black letters-title">Letters:</h2>
				<h1 class="scrambled-letters">{{ state.letters }}</h1>
				<p class="definition">{{ state.definition }}</p>
				<form @submit.prevent="checkWord" class="guess-inputs">
					<div>
						<input type="text" class="input-field guess-field" placeholder="Answer" v-model="state.answer" />
					</div>
					<div>
						<Button type="submit" class="guess-button" icon="fa-solid fa-check" size="icon" />
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from "vue";
import Freeze from "./effects/Freeze.vue";
import GameSidebar from "./GameSidebar.vue";
import Button from "@/components/Button.vue";
import { useToast } from "vue-toastification";

import ws from "@/gateway/websocket";

const toast = useToast();

const emit = defineEmits(["gameOver", "joinVoice", "leaveVoice"]);

const state = reactive({
	letters: "",
	answer: "",
	definition: "",
	effect: ""
});

function checkWord() {
	ws.emit("CHECK_GUESS", {
		answer: state.answer
	});

	state.answer = "";
}

ws.on("GAME_OVER", () => emit("gameOver"));
ws.on("CORRECT_GUESS", () => toast.success("Correct Guess!"));
ws.on("INCORRECT_GUESS", () => toast.error("Incorrect Guess!"));

ws.on("POWERUP_USED", (powerup) => {
	toast(`You used the ${powerup} powerup!`);
});

ws.on("POWERUP_RECEIVED", (powerup) => {
	switch (powerup.name) {
		case "freeze":
			toast(`You have been frozen for ${powerup.duration / 1000} seconds!`, {
				timeout: 10000,
				pauseOnFocusLoss: false
			});
			state.effect = "freeze";
			break;
	}
});

ws.on("POWERUP_EFFECT_CLEARED", (effect) => {
	switch (effect) {
		case "freeze":
			state.effect = "";
			break;
	}
});

ws.on("NEW_LETTERS", (data) => {
	state.letters = data.letters;
	state.definition = data.definition;
});

onBeforeUnmount(() => {
	ws.off("GAME_OVER");
	ws.off("CORRECT_GUESS");
	ws.off("INCORRECT_GUESS");
	ws.off("POWERUP_USED");
	ws.off("POWERUP_RECEIVED");
	ws.off("POWERUP_EFFECT_CLEARED");
	ws.off("NEW_LETTERS");
});
</script>

<style lang="css" scoped>
.game-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 2rem;
	width: 35rem;
	border-radius: 1rem;
	background-color: #15141a;
	border: 0.4rem solid #7d5afa;
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
	font-weight: 900;
	text-shadow: #fefb75 1px 0 10px;
}

.definition {
	font-size: 1rem;
	font-style: italic;
	text-align: center;
}
</style>
