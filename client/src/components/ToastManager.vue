<template>
	<div class="toasts-wrapper" v-if="state.toasts.length">
		<Toast v-for="(toast, index) of state.toasts" :toast="toast" :key="index" />
	</div>
</template>
  
<script setup>
import { reactive } from 'vue';
import Toast from './Toast.vue';

import { useToastStore } from '@/stores/Toast'

const state = reactive({
	toasts: [],
});

const toastStore = useToastStore();

state.toasts = toastStore.toasts;
</script>
  
<style lang="css" scoped>
.toasts-wrapper {
	position: relative;
	z-index: 999;
}
</style>