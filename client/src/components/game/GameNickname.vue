<template>
	<div class="flex flex-col justify-center items-center nickname-holder">
		<div class="flex flex-col items-center justify-center gap-4">
			<form @submit.prevent="attemptJoin()">
				<input type="text" class="input-field" placeholder="Nickname" v-model="state.nickname" />
				<div class="flex flex-row justify-center items-center mt-4 w-full">
					<Button type="submit" text="Join" icon="fa-solid fa-right-to-bracket" />
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { reactive } from "vue";
import ws from "@/gateway/websocket";
import Button from "@/components/Button.vue";

const state = reactive({
	nickname: ""
});

const props = defineProps({
	gameId: {
		type: String,
		required: true
	}
});

const emit = defineEmits(["joined"]);

function attemptJoin() {
	ws.emit("PLAYER_JOIN", {
		game_id: props.gameId,
		nickname: state.nickname
	});

	ws.on("PLAYER_ALREADY_EXISTS", () => {
		state.gameStatus == "getPlayerInfo";
	});

	ws.on("PLAYER_JOIN_SUCCESS", () => {
		emit("joined");
	});
}
</script>

<style lang="css" scoped>
.nickname-holder {
	width: 25rem;
}
</style>
