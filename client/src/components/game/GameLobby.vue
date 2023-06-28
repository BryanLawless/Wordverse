<template>
	<div class="lobby-container">
		<div class="lobby-players">
			<h1 class="text-xl font-black">Players</h1>
			<div class="lobby-players-container">
				<div class="grid grid-cols-3">
					<div
						v-for="player in state.players"
						:key="player.player_socket_id"
						class="player">
						<div>{{ player.nickname }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lobby-players">
			<GameChat />
		</div>
	</div>
	<div class="flex flex-row justify-end gap-2 mt-5">
		<select name="gamemode" class="select-box" v-model="state.gamemode">
			<option value="" disabled selected>Gamemode</option>
			<option value="scramble">Scramble</option>
			<option value="pictionary">Pictionary</option>
		</select>
		<Button @click="copyLink()" icon="fa-solid fa-link" size="icon" />
		<Button @click="startGame()" icon="fa-regular fa-circle-play" size="icon" />
	</div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import GameChat from '@/components/game/GameChat.vue';
import Button from '@/components/Button.vue';

import ws from '@/gateway/websocket';
import { useRoute } from 'vue-router';
import { GameService } from '@/services/game';
import { useToast } from 'vue-toastification';
import { Player, Game } from '@/types/game.types';

const toast = useToast();
const route = useRoute();

const state = reactive({
	gameId: '',
	gamemode: '',
	players: [] as Player[],
	currentPlayer: {}
});

const emit = defineEmits(['gameStarting', 'setGameMode']);

ws.on('UPDATE_PLAYER_LIST', (data) => (state.players = data));
ws.on('GAME_STARTING', (data: Game) => emit('gameStarting', data.mode));

onBeforeUnmount(() => {
	ws.off('UPDATE_PLAYER_LIST');
	ws.off('GAME_STARTING');
});

function copyLink() {
	navigator.clipboard.writeText(document.location.href).then(
		function () {
			toast.success('Link Copied!', { timeout: 4000 });
		},
		function () {
			toast.error('Could not copy link.', { timeout: 4000 });
		}
	);
}

function startGame() {
	ws.emit('START_GAME', {
		game_id: route.params.id,
		game_mode: state.gamemode
	});
}

async function fetchPlayers() {
	let players = await GameService.getGamePlayers(route.params.id);

	let p = players as any;

	if (p.length > 0) state.players = p;
}

onBeforeMount(async () => fetchPlayers());
</script>

<style lang="css" scoped>
.lobby-container {
	display: flex;
	flex-direction: row;
	height: 30rem;
	gap: 2rem;
	border-radius: 1rem;
	background-color: #15141a;
	border: 0.4rem solid #7d5afa;
}

.lobby-players {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 30rem;
	padding: 1rem;
	border-radius: 1rem;
}

.player {
	display: flex;
	justify-content: center;
	padding: 1rem;
	margin: 1rem;
	border-radius: 8px;
	color: #fff;
	background-color: #7d5afa;
}

.lobby-main {
	display: flex;
	flex-direction: column;
	position: relative;
	width: 40em;
	border-radius: 1rem;
}

.select-box {
	background-color: #15141a;
	border: 0.4rem solid #7d5afa;
	padding: 6px 12px;
	text-transform: uppercase;
	font-weight: bold;
	font-size: 30px;
	border-radius: 1.5rem;
	width: 18rem;
	height: 5.5rem;
	transition: 0.1s;
	text-align: center;
	color: #7d5afa;
}
</style>
