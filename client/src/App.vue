<template>
	<div class="texture">
		<CheckingOnline v-if="!state.serverAvailable" @online="state.serverAvailable = true" />
		<router-view v-if="state.serverAvailable" v-slot="{ Component, route }">
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
import { reactive } from 'vue';
import ToastManager from '@/components/ToastManager.vue';
import CheckingOnline from '@/components/home/CheckingOnline.vue';

import ws from '@/gateway/Websocket';
import { useToastStore } from '@/stores/Toast';

const toastStore = useToastStore();

const state = reactive({
	serverAvailable: false
});

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