<template>
	{{ state.time }}
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { getTimeRemaining } from '@/helpers/Utility';

const state = reactive({
	time: '',
});

const props = defineProps({
	timestamp: {
		type: String,
		required: true
	}
});

let timeInterval;
function updateClock() {
	const timeRemaining = getTimeRemaining(props.timestamp);
	state.time = `${('0' + timeRemaining.minutes).slice(-2)}:${('0' + timeRemaining.seconds).slice(-2)}`;

	if (timeRemaining.total <= 0) clearInterval(timeInterval);
}

onMounted(() => {
	updateClock();
	timeInterval = setInterval(updateClock, 1000);
});
</script>