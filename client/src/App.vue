<template>
	<div class="texture">
		<router-view v-slot="{ Component, route }">
			<transition name="page-slide" mode="out-in">
				<div :key="route.name">
					<ToastManager />
					<component :is="Component" />
				</div>
			</transition>
		</router-view>
	</div>
</template>

<script setup>
import ToastManager from './components/ToastManager.vue';

import ws from './gateway/Websocket';
import { useToastStore } from '@/stores/Toast';

const toastStore = useToastStore();

ws.on('ERROR_OCCURED', (error) => {
	toastStore.addToast('error', error)
});
</script>

<style lang="css" scoped>
.page-slide-enter-active,
.page-slide-leave-active {
	transition: 400ms ease all;
}

.page-slide-enter-from,
.page-slide-leave-to {
	opacity: 0;
	transform: translateY(60px);
}

.texture {
	background-image: url('./assets/svg/polygon.svg');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>