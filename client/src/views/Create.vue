<template>
	<div class="flex flex-col justify-center gap-4 items-center create-holder">
		<input
			type="text"
			class="input-field"
			placeholder="Game Name"
			v-model.number="state.gameName" />
		<input
			type="number"
			class="input-field"
			min="1"
			max="10"
			placeholder="Players Allowed"
			v-model="state.playersAllowed" />
		<Button @click="createGame" text="Create Game" icon="fas fa-plus" />
	</div>
</template>

<script setup>
import { reactive } from "vue";
import Button from "@/components/Button.vue";

import ws from "@/gateway/websocket";
import { redirect } from "@/helpers/utility";

const state = reactive({
	gameName: "",
	playersAllowed: 2
});

function createGame() {
	ws.emit("CREATE_GAME", {
		game_name: state.gameName,
		players_allowed: state.playersAllowed
	});

	ws.on("GAME_CREATED", (data) => {
		redirect("game", { id: data.game_id });
	});
}
</script>

<style lang="css" scoped>
.create-holder {
	width: 25rem;
}
</style>
