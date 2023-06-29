<template>
	<div class="message-list invisible-scrollbar mb-2" id="message-list">
		<div class="m-1" v-for="message in state.messages">
			<span :class="message.from === '[Server]' ? 'server-highlight' : ''"
				>{{ message.from }}:</span
			>
			{{ message.message }}
		</div>
	</div>
	<div class="message-control">
		<input
			type="text"
			class="input-field"
			id="message-box"
			aria-placeholder="Type message..."
			placeholder="Type message..."
			@keyup.enter.prevent="sendMessage()"
			v-model="state.message" /><br />
	</div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive } from 'vue';
import ws from '@/gateway/websocket';
import { Message } from '@/types/gateway.types';

const state = reactive({
	message: '',
	messages: [] as Message[]
});

let messages: HTMLElement | null;
onMounted(() => {
	messages = document.getElementById('message-list');
});

ws.on('RECEIVE_MESSAGE', (data: Message) => {
	state.messages.push(data);
	messages!.scrollTop = messages!.scrollHeight + 100;
});

onBeforeUnmount(() => {
	ws.off('RECEIVE_MESSAGE');
});

function sendMessage() {
	ws.emit('SEND_MESSAGE', { message: state.message });
	state.message = '';
}
</script>

<style lang="css" scoped>
.message-list {
	width: 100%;
	height: 30rem;
	overflow-y: scroll;
}

.server-highlight {
	color: #fefb75;
	font-weight: bold;
}
</style>
