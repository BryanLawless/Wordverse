<template>
	<div class="texture">
		<CheckingOnline v-if="!state.serverAvailable" @online="state.serverAvailable = true" />
		<router-view v-if="state.serverAvailable" v-slot="{ Component, route }">
			<transition name="page-slide" mode="out-in">
				<div :key="route.name">
					<component :is="Component" />
				</div>
			</transition>
		</router-view>
	</div>
</template>

<script setup>
import { reactive } from 'vue';
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