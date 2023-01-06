<template>
	<div class="game-store-container">
		<h1 class="heading-effect">Game <span class="heading-effect-invert">Store</span></h1>
		<Button @click="emit('backToGame')" text="Back to Game" icon="fa-solid fa-arrow-left" />
		<div class="store-container box-gradient">
			<div class="store-content">
				<div class="powerup-row">
					<div class="powerup">
						<h3>Freeze</h3>
						<p>Freeze a random player for 10 seconds.</p>
						<button @click="usePowerup('freeze')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic">
							<span> 6</span>
						</button>
					</div>
					<div class="powerup">
						<h3>Re-Scramble</h3>
						<p>Re-scrambles a random players word.</p>
						<button @click="usePowerup('scramble')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic">
							<span> 9</span>
						</button>
					</div>
				</div>
				<div class="powerup-row">
					<div class="powerup">
						<h3>Robbery</h3>
						<p>Steals another player's money. 10% chance of failure.</p>
						<button @click="usePowerup('robbery')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic">
							<span> 10</span>
						</button>
					</div>
					<div class="powerup">
						<h3>Lottery</h3>
						<p>15% chance to double your money.</p>
						<button @click="usePowerup('lottery')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic">
							<span> 18</span>
						</button>
					</div>
				</div>
				<div class="powerup-row">
					<div class="powerup">
						<h3>Setback</h3>
						<p>Set another player's score back by 5.</p>
						<button @click="usePowerup('setback')" class="powerup-price">
							<img src="/src/assets/images/coin.png" class="value-graphic">
							<span> 20</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Button from '../Button.vue';
import ws from '@/gateway/Websocket';

const emit = defineEmits(['backToGame']);

function usePowerup(powerup) {
	ws.emit('USE_POWERUP', {
		powerup: powerup
	});
}
</script>

<style lang="css" scoped>
.game-store-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 135vh;
	gap: 2.5rem;
	position: relative;
}

.store-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	border-radius: 1rem;
}

.store-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}

.store-content .powerup-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
}

.powerup-row .powerup {
	display: flex;
	flex-direction: column;
	background: #903bec;
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



