<template>
	<div class="container">
		<div class="nickname-container box-gradient">
			<h1>Enter Nickname</h1>
			<form @submit.prevent="attemptJoin()">
				<input type="text" class="input-field" placeholder="Nickname" v-model="state.nickname">
				<div class="btn-center nickname-button-spacing">
					<Button type="submit" text="Join" icon="fa-solid fa-right-to-bracket" />
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import ws from '@/gateway/Websocket';
import Button from '@/components/Button.vue';

const state = reactive({
	nickname: '',
});

const props = defineProps({
	gameId: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(['joined']);

function attemptJoin() {
	ws.emit('PLAYER_JOIN', {
		game_id: props.gameId,
		nickname: state.nickname,
	})

	ws.on('PLAYER_ALREADY_EXISTS', () => {
		state.gameStatus == 'getPlayerInfo';
	});

	ws.on('PLAYER_JOIN_SUCCESS', () => {
		emit('joined');
	});
}
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

.nickname-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	border-radius: 1rem;
}

.nickname-button-spacing {
	margin-top: 1rem;
}
</style>