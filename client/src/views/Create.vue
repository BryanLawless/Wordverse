<template>
	<div class="container">
		<h1 class="heading-effect">Create <span class="heading-effect-invert">Game</span></h1>
		<div class="create-container box-gradient">
			<input type="text" class="input-field" placeholder="Game Name" v-model.number="state.gameName">
			<input type="number" class="input-field" min="1" max="10" placeholder="Players Allowed"
				v-model="state.playersAllowed">
			<Button @click="createGame" text="Create Game" icon="fas fa-plus" />
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import Button from '@/components/Button.vue';

import ws from '@/gateway/Websocket';
import { redirect } from '@/helpers/Utility';

const state = reactive({
	gameName: '',
	playersAllowed: 2,
});

function createGame() {
	ws.emit('CREATE_GAME', {
		game_name: state.gameName,
		players_allowed: state.playersAllowed
	});

	ws.on('GAME_CREATED', (data) => {
		redirect('game', { id: data.game_id });
	});
}
</script>

<style lang="css" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	gap: 3.5rem;
	position: relative;
}

.create-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	padding: 2rem;
	min-width: 30rem;
	border-radius: 1rem;
}

.game-mode-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 1.5rem;
	border-radius: 1.5rem;
	background-color: #1a1a25;
}

.isHidden {
	display: none;
}

.label {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 10rem;
	height: 10rem;
	border-radius: 1rem;
	background-color: #0c0c2d;
	border: 2px solid #0c0c2d;
}

.radio:checked+.label {
	border: 2px solid aqua;
	box-shadow: 1px 4px 15px 1px rgba(0, 255, 255, 0.39);
}
</style>