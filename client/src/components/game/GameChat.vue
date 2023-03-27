<template>
	<div class="message-list invisible-scrollbar mb-2" id="message-list">
		<div class="m-1" v-for="message in state.messages">
			{{ message.from }}: {{ message.message }}
		</div>
	</div>
	<div class="message-control">
		<input type="text" class="input-field" id="message-box" aria-placeholder="Type message..."
			placeholder="Type message..." @keyup.enter.prevent="sendMessage()" v-model="state.message" /><br />
	</div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from "vue";
import ws from "@/gateway/websocket";

const state = reactive({
	message: "",
	messages: []
});

var messages;
onMounted(() => {
	messages = document.getElementById("message-list");
});

ws.on("RECEIVE_MESSAGE", (data) => {
	state.messages.push(data);
	messages.scrollTop = messages.scrollHeight + 100;
});

onBeforeUnmount(() => {
	ws.off("RECEIVE_MESSAGE");
});

function sendMessage() {
	ws.emit("SEND_MESSAGE", { message: state.message });
	state.message = "";
}
</script>

<style lang="css" scoped>
.message-list {
	width: 100%;
	height: 30rem;
	overflow-y: scroll;
}
</style>
