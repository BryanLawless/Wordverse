<template>
	<div class="container">
		<div class="tutorial-text">
			<transition name="tutorial-slide" mode="out-in">
				<div id="tutorial-container" :key="state.step.length">{{ state.step }}</div>
			</transition>
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
import ws from '@/gateway/Websocket';

const state = reactive({
	step: "",
});

const emit = defineEmits(['tutorialFinished']);

ws.on('TUTORIAL_PROGRESS', (step) => state.step = step);

ws.on('TUTORIAL_FINISHED', () => emit('tutorialFinished'));
</script>

<style lang="css" scoped>
.tutorial-slide-enter-active,
.tutorial-slide-leave-active {
	transition: 400ms ease all;
}

.tutorial-slide-enter-from,
.tutorial-slide-leave-to {
	opacity: 0;
	transform: translateY(60px);
}

.tutorial-text {
	font-size: 3.5rem;
	text-align: center;
	width: 50%;
}
</style>