<template>
	<div class="flex flex-col justify-center gap-4 items-center">
		<div class="flex flex-col w-2/5">
			<div class="flex flex-row gap-2 mb-4 justify-center">
				<Button @click="joinRandomGame()" icon="fas fa-dice-five" size="medium" />
				<Button @click="redirect('create')" icon="fas fa-plus" size="medium" />
				<Button @click="fetchGames()" icon="fas fa-sync" size="medium" />
			</div>

			<div v-if="state.games.length == 0">
				<SimpleLoader text="Finding Games..." />
			</div>

			<div class="flex flex-col justify-start items-center gap-4 games-container">
				<div v-for="(game, index) in state.games" :key="index" class="game w-full">
					<div @click="redirect('game', { id: game.game_id })" class="flex flex-col justify-center w-full">
						<h2 class="text-base font-bold game-name">{{ game.game_name }}</h2>
						<small class="font-semibold">Players:
							{{ game.player_count + '/' + game.players_allowed }}</small>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, reactive } from 'vue';
import Button from '@/components/Button.vue';
import SimpleLoader from '@/components/SimpleLoader.vue';

import ws from '@/gateway/websocket';
import { redirect } from '@/helpers/utility';
import { GameService } from '@/services/game';

const state = reactive({
	games: [],
	joinModel: false
});

ws.on('GAME_CREATED', (data) => {
	state.games.push(data);
});

ws.on('GAME_REMOVED', (gameId) => {
	state.games = state.games.filter((game) => game.game_id != gameId);
});

function joinRandomGame() {
	if (state.games.length > 0) {
		let randomGame =
			state.games[Math.floor(Math.random() * state.games.length)];
		redirect('game', { id: randomGame.game_id });
	}
}

async function fetchGames() {
	let games = await GameService.getGames();

	let g = games as any;

	if (g.length > 0) state.games = g;
}

onMounted(async () => fetchGames());

onBeforeUnmount(() => {
	ws.off('GAME_CREATED');
	ws.off('GAME_REMOVED');
});
</script>

<style lang="css" scoped>
.game {
	padding: 1rem;
	cursor: pointer;
	border-radius: 1rem;
	border: 3px solid#7d5afa;
	background-color: #15141a;
}

.game-name {
	color: #8b6df7;
	font-size: 1.2rem;
}
</style>
