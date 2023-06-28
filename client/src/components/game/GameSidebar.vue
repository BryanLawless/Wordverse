<template>
	<aside class="sidebar invisible-scrollbar">
		<div class="inner-container">
			<div class="game-value-container">
				<div class="game-timer">
					<GameTimer
						v-if="state.timestamp.length > 0"
						:timestamp="state.timestamp" />
				</div>
				<div v-if="props.showScore" class="game-value-score">
					<img src="@/assets/images/medal.png" class="value-graphic" />
					<span>{{ state.score }}</span>
				</div>
				<div v-if="props.showCoins" class="game-value-coins">
					<img src="@/assets/images/coin.png" class="value-graphic" />
					<span>{{ state.coins }}</span>
				</div>
			</div>
			<div class="tab-container">
				<button
					v-if="props.showPowerups"
					@click="openTab($event, 'powerups')"
					class="tablinks active">
					Powerups
				</button>
				<button
					@click="openTab($event, 'chat')"
					class="tablinks"
					:class="props.showPowerups == false ? 'active' : ''">
					Chat & Voice
				</button>
			</div>
			<div
				class="tab-content invisible-scrollbar"
				id="powerups"
				:style="props.showPowerups ? 'display: block' : 'display: none'">
				<div class="game-powerup-container">
					<div class="powerup">
						<h3 class="leading-none text-xl font-semibold">Re-Scramble</h3>
						<p>Re-scrambles your word if your stuck. Difficulty's the same.</p>
						<button @click="usePowerup('scramble')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic" />
							<span> 2</span>
						</button>
					</div>
					<div class="powerup">
						<h3 class="leading-none text-xl font-semibold">Freeze</h3>
						<p>Freeze a random player for ten seconds.</p>
						<button @click="usePowerup('freeze')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic" />
							<span> 6</span>
						</button>
					</div>
					<div class="powerup">
						<h3 class="leading-none text-xl font-semibold">Robbery</h3>
						<p>
							50% chance to steal another players money and get what you spent
							back.
						</p>
						<button @click="usePowerup('robbery')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic" />
							<span> 10</span>
						</button>
					</div>
					<div class="powerup">
						<h3 class="leading-none text-xl font-semibold">Lottery</h3>
						<p>15% chance to double your money and get what you spent back.</p>
						<button @click="usePowerup('lottery')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic" />
							<span> 12</span>
						</button>
					</div>
					<div class="powerup">
						<h3 class="leading-none text-xl font-semibold">Setback</h3>
						<p>Set another player's score back by five medals.</p>
						<button @click="usePowerup('setback')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic" />
							<span> 15</span>
						</button>
					</div>
				</div>
			</div>
			<div
				class="tab-content invisible-scrollbar"
				id="chat"
				:style="
					props.showPowerups == false ? 'display: block' : 'display: none'
				">
				<div class="flex flex-col gap-1">
					<GameChat />
					<Button
						@click="emit('joinVoice')"
						text="Join Voice"
						icon="fa-solid fa-microphone"
						variant="invert"
						size="fit" />
					<Button
						@click="emit('leaveVoice')"
						text="Leave Voice"
						icon="fa-solid fa-microphone-slash"
						variant="invert"
						size="fit" />
				</div>
			</div>
		</div>
	</aside>
</template>

<script lang="ts" setup>
import { reactive, onBeforeUnmount } from 'vue';
import Button from '@/components/Button.vue';
import GameTimer from './GameTimer.vue';
import GameChat from './GameChat.vue';

import ws from '@/gateway/websocket';

const emit = defineEmits(['joinVoice', 'leaveVoice']);

const state = reactive({
	timestamp: '',
	score: 0,
	coins: 0
});

const props = defineProps({
	showCoins: {
		type: Boolean,
		default: true
	},
	showScore: {
		type: Boolean,
		default: true
	},
	showStatus: {
		type: Boolean,
		default: true
	},
	showPowerups: {
		type: Boolean,
		default: true
	}
});

function usePowerup(powerup: string) {
	ws.emit('USE_POWERUP', {
		powerup: powerup
	});
}

function openTab(e: Event, tabName: string) {
	let tabContent, tabLinks;
	tabContent = document.getElementsByClassName('tab-content');
	for (let i = 0; i < tabContent.length; i++) {
		let t = tabContent[i] as any;
		t.style.display = 'none';
	}

	tabLinks = document.getElementsByClassName('tablinks');
	for (let i = 0; i < tabLinks.length; i++) {
		tabLinks[i].className = tabLinks[i].className.replace(' active', '');
	}

	document.getElementById(tabName)!.style.display = 'block';
	let evt = e.currentTarget as any;
	evt.className += ' active';
}

ws.on('UPDATE_SCORE', (score) => (state.score = score));
ws.on('UPDATE_COINS', (coins) => (state.coins = coins));
ws.on('SET_TIMER', (time) => (state.timestamp = time));

onBeforeUnmount(() => {
	ws.off('UPDATE_SCORE');
	ws.off('UPDATE_COINS');
	ws.off('SET_TIMER');
});
</script>

<style lang="css" scoped>
.sidebar {
	height: 100vh;
	width: 30rem;
	color: white;
	overflow-y: scroll;
	overflow-x: hidden;
	background: #7d5afa;
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
	gap: 0.5rem;
	align-items: center;
	text-align: center;
}

.powerup .powerup-price {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	background-color: rgba(210, 213, 255, 0.3);
	padding: 0.5rem;
	width: 6rem;
	border-radius: 1rem;
	border: 2px solid #fefb75;
	color: #fff;
	cursor: pointer;
}

.tab-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tab-container button {
	height: 2.5rem;
	border: none;
	cursor: pointer;
	transition: 0.3s;
	font-size: 17px;
	margin: 4px;
	border-radius: 1rem;
	padding: 6px 18px;
	font-weight: semibold;
	background-color: #5f4bc1;
}

.tab-container button.active {
	background-color: #fff;
	color: #15141a;
}

.tab-content {
	display: none;
	padding: 6px 12px;
	border-top: none;
	background-color: transparent;
	color: #ddd;
	height: 100%;
	overflow: hidden;
	overflow-y: scroll;
}
</style>
