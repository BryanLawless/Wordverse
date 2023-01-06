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
import { reactive, onBeforeMount, onBeforeUnmount } from 'vue';
import ws from '@/gateway/Websocket';

const state = reactive({
	step: "",
});

const emit = defineEmits(['tutorialFinished']);

onBeforeMount(() => {
	ws.on('TUTORIAL_PROGRESS', (step) => state.step = step);
	ws.on('TUTORIAL_FINISHED', () => emit('tutorialFinished'));
});

onBeforeUnmount(() => {
	ws.off('TUTORIAL_PROGRESS');
	ws.off('TUTORIAL_FINISHED');
});
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