<template>
	<div class="lobby-container">
		<div class="lobby-players">
			<h1 class="text-xl font-black">Players</h1>
			<div class="lobby-players-container">
				<div class="grid grid-cols-3">
					<div v-for="player in state.players" :key="player.player_socket_id" class="player">
						<div>{{ player.nickname }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="lobby-players">
			<GameChat />
		</div>
	</div>
	<div class="flex flex-row justify-center gap-2 mt-5">
		<Button @click="copyLink()" text="Copy Link" icon="fa-solid fa-link" size="small" />
		<Button @click="startGame()" text="Start Game" icon="fa-regular fa-circle-play" size="small" />
	</div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, reactive } from "vue";
import GameChat from "@/components/game/GameChat.vue";
import Button from "@/components/Button.vue";

import ws from "@/gateway/websocket";
import { useRoute } from "vue-router";
import { GameService } from "@/services/game";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();

const state = reactive({
	gameId: "",
	players: [],
	currentPlayer: {}
});

const emit = defineEmits(["gameStarting"]);

ws.on("UPDATE_PLAYER_LIST", (data) => (state.players = data));
ws.on("GAME_STARTING", () => emit("gameStarting"));

onBeforeUnmount(() => {
	ws.off("UPDATE_PLAYER_LIST");
	ws.off("GAME_STARTING");
});

function copyLink() {
	navigator.clipboard.writeText(document.location.href).then(
		function () {
			toast.success("Link Copied!", { timeout: 4000 });
		},
		function () {
			toast.error("Could not copy link.", { timeout: 4000 });
		}
	);
}

function startGame() {
	ws.emit("START_GAME", {
		game_id: route.params.id
	});
}

async function fetchPlayers() {
	let players = await GameService.getGamePlayers(route.params.id);
	if (players) state.players = players;
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
	position: relative;
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

.gamemode {
	padding: 1rem;
	text-align: center;
	border-radius: 8px;
	background-color: #0f0f0f59;
}
</style>
