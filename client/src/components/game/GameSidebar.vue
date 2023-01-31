<template>
	<nav class="sidebar">
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
			<div class="game-powerup-container">
				<div class="powerup">
					<h3>Re-Scramble</h3>
					<p>Re-scrambles your word if your stuck.</p>
					<button @click="usePowerup('scramble')" class="powerup-price">
						<img src="/src/assets/images/coin.png" class="value-graphic">
						<span> 2</span>
					</button>
				</div>
				<div class="powerup">
					<h3>Freeze</h3>
					<p>Freeze a random player for 10 seconds.</p>
					<button @click="usePowerup('freeze')" class="powerup-price">
						<img src="/src/assets/images/coin.png" class="value-graphic">
						<span> 6</span>
					</button>
				</div>
				<div class="powerup">
					<h3>Robbery</h3>
					<p>50% chance to steal another players money and get what you spent back.</p>
					<button @click="usePowerup('robbery')" class="powerup-price">
						<img src="/src/assets/images/coin.png" class="value-graphic">
						<span> 10</span>
					</button>
				</div>
				<div class="powerup">
					<h3>Lottery</h3>
					<p>15% chance to double your money and get what you spent back.</p>
					<button @click="usePowerup('lottery')" class="powerup-price">
						<img src="/src/assets/images/coin.png" class="value-graphic">
						<span> 12</span>
					</button>
				</div>
				<div class="powerup">
					<h3>Setback</h3>
					<p>Set another player's score back by five trophies.</p>
					<button @click="usePowerup('setback')" class="powerup-price">
						<img src="/src/assets/images/coin.png" class="value-graphic">
						<span> 15</span>
					</button>
				</div>
			</div>
		</div>
	</nav>
</template>

<script setup>
import { reactive, onBeforeUnmount } from 'vue';
import GameTimer from './GameTimer.vue';

import ws from '@/gateway/Websocket';

const state = reactive({
	timestamp: '',
	score: 0,
	coins: 0,
});

function usePowerup(powerup) {
	ws.emit('USE_POWERUP', {
		powerup: powerup
	});
}

ws.on('UPDATE_SCORE', (score) => state.score = score);
ws.on('UPDATE_COINS', (coins) => state.coins = coins);
ws.on('GAME_TIMER_SET', (time) => state.timestamp = time);

onBeforeUnmount(() => {
	ws.off('UPDATE_SCORE');
	ws.off('UPDATE_COINS');
	ws.off('GAME_TIMER_SET');
})

</script>

<style lang="css" scoped>
.sidebar {
	height: 100vh;
	width: 35rem;
	color: white;
	background: #7856f2;
	overflow-y: scroll;
}

.inner-container {
	display: flex;
	width: 100%;
	gap: 1rem;
	margin-top: 10px;
	margin-bottom: 10px;
	align-items: center;
	flex-direction: column;
	justify-content: center;
}

.game-value-container {
	display: flex;
	flex-direction: row;
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

.game-powerup-container {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;
}

.powerup {
	display: flex;
	flex-direction: column;
	background: #8a69ff;
	padding: 2rem;
	border-radius: 1rem;
	max-width: 20rem;
}

.powerup .powerup-heading {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.powerup .powerup-price {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: rgba(210, 213, 255, 0.3);
	padding: 0.5rem;
	min-width: 6rem;
	border-radius: 1rem;
	border: 2px solid #fefb75;
	color: #fff;
	cursor: pointer;
}
</style>