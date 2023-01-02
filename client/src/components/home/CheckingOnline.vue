<template>
	<div class="container">
		<div class="online-container box-gradient">
			<h2>{{ state.title }}</h2>
			<p class="online-message">{{ state.message }}</p>
			<SimpleLoader />
		</div>
	</div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import SimpleLoader from '@/components/SimpleLoader.vue';
import { serverOnline } from '@/helpers/Utility';

const state = reactive({
	title: 'Hang On!',
	message: 'We are checking if our game server is online, it may take up to 30 seconds for it to wake up.',
	currentlyChecking: true,
});

const emit = defineEmits(['online']);

onMounted(async () => {
	const serverReachable = await serverOnline();

	if (!serverReachable) {
		state.title = 'Server Offline';
		state.message = 'Our game server is currently offline, please try again later.';
	} else {
		emit('online');
	}
});
</script>

<style lang="css" scoped>
.online-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 2rem;
	border-radius: 1rem;
}

.online-message {
	max-width: 20rem;
	text-align: center;
}
</style>