<template>
	<div class="container">
		<div class="lobby-container">
			<div class="lobby-players box-gradient">
				<h1>Players</h1>
				<div class="lobby-players-container">
					<div v-for="player in state.players" :key="player.player_socket_id" class="player">
						<div>{{ player.nickname }}</div>
					</div>
				</div>
				<div class="game-controls">
					<Button @click="startGame()" text="Start Game" size="small" />
				</div>
			</div>
			<!--<div class="lobby-main box-gradient">
				<div class="game-controls">
					<Button @click="startGame()" text="Start Game" size="small" />
				</div>
			</div>-->
		</div>
	</div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import Button from '@/components/Button.vue';

import ws from '@/gateway/Websocket';
import { useRoute } from 'vue-router';
import { GameService } from '@/services/Game';

const route = useRoute();

const state = reactive({
	gameId: "",
	players: [],
	currentPlayer: {},
});

const emit = defineEmits(['gameStarting']);

ws.on('UPDATE_PLAYER_LIST', (data) => state.players = data);
ws.on('GAME_STARTING', () => emit('gameStarting'));

onBeforeUnmount(() => {
	ws.off('UPDATE_PLAYER_LIST');
	ws.off('GAME_STARTING');
});

function startGame() {
	ws.emit('START_GAME', {
		game_id: route.params.id,
	});
}

async function fetchPlayers() {
	let players = await GameService.getGamePlayers(route.params.id);
	if (players) state.players = players;
}

onBeforeMount(async () => fetchPlayers());
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

.lobby-container {
	display: flex;
	flex-direction: row;
	height: 30rem;
	gap: 2rem;
}

.lobby-players {
	display: flex;
	flex-direction: column;
	position: relative;
	align-items: center;
	width: 15rem;
	padding: 1rem;
	border-radius: 1rem;
}

.player {
	display: flex;
	justify-content: center;
	padding: 1rem;
	margin: 1rem;
	border-radius: 8px;
	background-color: #0f0f0f59;
}

/*.lobby-main {
	display: flex;
	flex-direction: column;
	position: relative;
	width: 40em;
	border-radius: 1rem;
}*/

.game-controls {
	display: flex;
	flex-direction: row;
	position: absolute;
	bottom: 0;
	/*right: 0;*/
	padding: 1rem;
}
</style>