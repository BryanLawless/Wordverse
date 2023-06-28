<template>
	<span>{{ state.time }}</span>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue';
import { getTimeRemaining } from '@/helpers/utility';

const state = reactive({
	time: ''
});

const props = defineProps({
	timestamp: {
		type: String,
		required: true
	}
});

onMounted(() => startTimer());

watch(
	() => props.timestamp,
	() => startTimer()
);

let timeInterval: NodeJS.Timeout;
function updateClock() {
	const timeRemaining = getTimeRemaining(props.timestamp);
	state.time = `${('0' + timeRemaining.minutes).slice(-2)}:${(
		'0' + timeRemaining.seconds
	).slice(-2)}`;

	if (timeRemaining.total <= 0) clearInterval(timeInterval);
}

function startTimer() {
	updateClock();
	timeInterval = setInterval(updateClock, 1000);
}
</script>
