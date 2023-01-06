<template>
	<div class="container">
		<GameNotFound v-if="state.gameStatus == 'gameNotFound'" />
		<GameNickname v-if="state.gameStatus == 'getNickname'" :gameId="route.params.id"
			@joined="state.gameStatus = 'gameLobby'" />
		<GameLobby v-if="state.gameStatus == 'gameLobby'" @gameStarting="startGame" />
		<GameTutorial v-if="state.gameStatus == 'gameStarting'" @tutorialFinished="state.gameStatus = 'gamePlaying'" />
		<GamePlayable v-if="state.gameStatus == 'gamePlaying'" @gameOver="state.gameStatus = 'gameOver'" />
		<GameLeaderboard v-if="state.gameStatus == 'gameOver'" />
	</div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import GameNotFound from '@/components/game/GameNotFound.vue';
import GameNickname from '@/components/game/GameNickname.vue';
import GameLobby from '@/components/game/GameLobby.vue';
import GameTutorial from '@/components/game/GameTutorial.vue';
import GamePlayable from '@/components/game/GamePlayable.vue';
import GameLeaderboard from '@/components/game/GameLeaderboard.vue';

import ws from '@/gateway/Websocket';
import { useRoute } from 'vue-router';
import { GameService } from '@/services/Game';
import { redirect, audioEffectFadeIn } from '@/helpers/Utility';

import gameMusic from '@/assets/audio/game.mp3';

const route = useRoute();

const state = reactive({
	gameStatus: 'getNickname',
});

var audio = new Audio(gameMusic);

function playMusic() {
	audio.loop = true;
	audio.play();
	audioEffectFadeIn(audio);
}

function stopMusic() {
	audio.pause();
	audio.src = audio.src;
}

function startGame() {
	state.gameStatus = 'gameStarting';
	playMusic();
}

onBeforeMount(async () => {
	let game = await GameService.getGame(route.params.id);
	if (!game) state.gameStatus = 'gameNotFound';
});

ws.on('GAME_NOT_FOUND', () => state.gameStatus = 'gameNotFound');

ws.on('HOST_DISCONNECT', () => redirect('join'));

onBeforeUnmount(() => {
	ws.emit('PLAYER_LEAVE');
	stopMusic();

	ws.off('GAME_NOT_FOUND');
	ws.off('HOST_DISCONNECT');
});

</script>