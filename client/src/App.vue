<template>
	<div class="texture">
		<router-view v-slot="{ Component, route }">
			<div class="flex flex-col justify-center gap-4 h-screen"
				:class="designStore.showBanner == true ? 'items-center' : null">
				<div v-if="designStore.showBanner == true && route.name !== '404'" class="flex flex-col items-center gap-4">
					<h1 class="font-black leading-none">
						<span class="heading-effect">Word</span>
						<span class="heading-effect-other">verse</span>
					</h1>
					<div class="banner">Multiplayer Word Games</div>
				</div>
				<transition v-if="state.serverAvailable" name="page-fade" mode="out-in">
					<div :key="route.name">
						<component :is="Component" />
					</div>
				</transition>
				<div v-if="!state.serverAvailable" class="warning">
					Server is offline, try again later
				</div>
			</div>
		</router-view>
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from "vue";

import ws from "@/gateway/websocket";
import { useToast } from "vue-toastification";
import { serverOnline } from "@/helpers/utility";
import { useDesignStore } from "@/stores/design.store";

const designStore = useDesignStore();

const toast = useToast();

const state = reactive({
	serverAvailable: true
});

ws.on("ERROR_OCCURRED", (error) => toast.error(error, { timeout: 4000 }));

onMounted(async () => {
	if (!(await serverOnline())) state.serverAvailable = false;
});

onBeforeUnmount(() => {
	ws.off("ERROR_OCCURRED");
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

.banner {
	background-color: #7d5afa;
	width: 30rem;
	text-align: center;
	border: 2px dashed #fefb75;
	border-radius: 1rem;
	padding: 0.8rem 1rem;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.5px;
}

.warning {
	background-color: #fa5a96;
	width: 30rem;
	text-align: center;
	border-radius: 1rem;
	padding: 0.8rem 1rem;
	text-transform: uppercase;
	font-weight: bold;
	letter-spacing: 0.5px;
}

.texture {
	background-image: url("./assets/svg/polygons.svg");
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;
}
</style>
