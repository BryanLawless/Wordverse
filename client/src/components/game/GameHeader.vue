<template>
	<header class="header-container">
		<div class="inner-container">
			<div class="game-value-container">
				<div class="game-timer">
					<GameTimer v-if="state.timestamp.length > 0" :timestamp="state.timestamp" />
				</div>
				<div class="game-value-score">
					<img src="@/assets/images/medal.png" class="value-graphic" />
					<span>{{ state.score }}</span>
				</div>
				<div class="game-value-coins">
					<img src="@/assets/images/coin.png" class="value-graphic" />
					<span>{{ state.coins }}</span>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { reactive, onBeforeMount } from 'vue';
import GameTimer from './GameTimer.vue';

import ws from '@/gateway/Websocket';

const state = reactive({
	timestamp: '',
	score: 0,
	coins: 0,
});

onBeforeMount(() => {
	ws.on('UPDATE_SCORE', (score) => state.score = score);
	ws.on('UPDATE_COINS', (coins) => state.coins = coins);
	ws.on('GAME_TIMER_SET', (time) => state.timestamp = time);
});
</script>

<style lang="css" scoped>
.header-container {
	display: flex;
	flex-wrap: wrap;
	background: transparent;
	padding: 10px 25px;
	width: 100%;
	z-index: 9;
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	align-items: center;
	justify-content: space-between;
}

.header-container .inner-container {
	display: flex;
	align-items: center;
	width: 100%;
	margin-top: 3px;
	margin-bottom: 3px;
	justify-content: space-between;
}

.game-value-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.game-timer {
	min-width: 7.2rem;
	font-size: 1.8rem;
	padding: 1rem;
	border-radius: 1rem;
	text-align: center;
	background-color: rgba(210, 213, 255, 0.3);
}

.game-value-coins,
.game-value-score {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: rgba(210, 213, 255, 0.3);
	padding: 0.5rem;
	min-width: 6rem;
	border-radius: 1rem;
}
</style>