<template>
	<div class="flex">
		<GameSidebar v-if="props.gameMode == 'pictionary'" :showCoins="false" :showScore="true" :showPowerups="false"
			@joinVoice="emit('joinVoice')" @leaveVoice="emit('leaveVoice')" />

		<GameSidebar v-if="props.gameMode == 'scramble'" :showCoins="true" :showScore="true" :showPowerups="true"
			@joinVoice="emit('joinVoice')" @leaveVoice="emit('leaveVoice')" />

		<div class="flex flex-col items-center justify-center gap-14 w-full h-screen">
			<Scramble v-if="props.gameMode == 'scramble'" />
			<Pictionary v-if="props.gameMode == 'pictionary'" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue';
import GameSidebar from './GameSidebar.vue';
import Scramble from './modes/scramble/Scramble.vue';
import Pictionary from './modes/pictionary/Pictionary.vue';

import ws from '@/gateway/websocket';

const emit = defineEmits(['gameOver', 'joinVoice', 'leaveVoice']);

const props = defineProps({
	gameMode: {
		type: String,
		required: true
	}
});

ws.on('GAME_OVER', () => emit('gameOver'));

onBeforeUnmount(() => {
	ws.off('GAME_OVER');
});
</script>

<style lang="css" scoped></style>
