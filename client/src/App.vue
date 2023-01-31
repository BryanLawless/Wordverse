<template>
	<div class="texture">
		<CheckingOnline v-if="!state.serverAvailable" @online="state.serverAvailable = true" />
		<router-view v-if="state.serverAvailable" v-slot="{ Component, route }">
			<transition name="page-fade" mode="out-in">
				<div :key="route.name">
					<component :is="Component" />
				</div>
			</transition>
		</router-view>
	</div>
</template>

<script setup>
import { onBeforeUnmount, reactive } from 'vue';
import CheckingOnline from '@/components/home/CheckingOnline.vue';

import ws from '@/gateway/Websocket';
import { useToast } from 'vue-toastification';

const toast = useToast();

const state = reactive({
	serverAvailable: false
});

ws.on('ERROR_OCCURED', (error) => {
	toast.error(error, {
		timeout: 4000
	});
});

onBeforeUnmount(() => {
	ws.off('ERROR_OCCURED');
});
</script>

<style lang="css" scoped>
.page-fade-enter-active,
.page-fade-leave-active {
	transition-duration: 0.3s;
	transition-property: opacity;
	transition-timing-function: ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
	opacity: 0;
}

.texture {
	background-image: url('./assets/svg/polygon.svg');
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>