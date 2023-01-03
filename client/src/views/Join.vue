<template>
	<div class="container">
		<h1 class="heading-effect">Join <span class="heading-effect-invert">Game</span></h1>
		<div class="join-container box-gradient">
			<div class="button-controls">
				<Button @click="joinRandomGame()" text="Join Random" icon="fas fa-dice-five" size="small" />
				<Button @click="redirect('create')" text="Create Game" icon="fas fa-plus" size="small" />
				<Button @click="fetchGames()" text="Refresh" icon="fas fa-sync" size="small" />
			</div>

			<div v-if="state.games.length == 0">
				<div class="loading-holder">
					<SimpleLoader />
					<p>Searching for Games...</p>
				</div>
			</div>

			<div class="games-container">
				<div v-for="(game, index) in state.games" :key="index" class="game">
					<div class="game-info">
						<h2>{{ game.game_name }}</h2>
						<small class="">Players: {{ game.players + "/" + game.players_allowed }}</small>
					</div>
					<div class="game-controls">
						<Button @click="redirect('game', { id: game.game_id })" text="Join" size="small" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
 
<script setup>
import { onMounted, reactive } from 'vue';
import Button from '@/components/Button.vue';
import SimpleLoader from '@/components/SimpleLoader.vue';

import ws from '@/gateway/Websocket';
import { redirect } from '@/helpers/Utility';
import { GameService } from '@/services/Game';

const state = reactive({
	games: [],
	joinModel: false,
});

ws.on('GAME_CREATED', (data) => {
	state.games.push(data);
});

ws.on('GAME_REMOVED', (gameId) => {
	state.games = state.games.filter((game) => game.game_id != gameId);
});

function joinRandomGame() {
	if (state.games.length > 0) {
		let randomGame = state.games[Math.floor(Math.random() * state.games.length)];
		redirect('game', { id: randomGame.game_id });
	}
}

async function fetchGames() {
	let games = await GameService.getGames();
	if (games) state.games = games;
}

onMounted(async () => fetchGames());
</script>

<style lang='css' scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	gap: 3.5rem;
	position: relative;
}

.join-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	padding: 2rem;
	min-width: 38rem;
	border-radius: 1rem;
}

.games-container {
	display: flex;
	gap: 1rem;
	justify-content: start;
	align-items: center;
	flex-direction: column;
	max-height: 25rem;
	min-width: 33rem;
	overflow-y: scroll;
}

.games-container .game {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	min-width: inherit;
	padding: 1rem;
	border-radius: 1.2rem;
	background-color: #903bec;
	color: #fff;
}

.button-controls {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.games-container .game .game-info {
	display: flex;
	gap: 2px;
	flex-direction: column;
	justify-content: center;
}

.games-container .game .game-controls {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.loading-holder {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>