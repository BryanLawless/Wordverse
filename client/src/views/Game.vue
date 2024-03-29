<template>
	<GameNickname v-if="state.gameStatus == 'getNickname'" :gameId="(route.params.id as string)"
		@joined="changeScreen('gameLobby')" />
	<GameLobby v-if="state.gameStatus == 'gameLobby'" @gameStarting="startGame" />
	<PlayArea v-if="state.gameStatus == 'playArea'" :gameMode="state.gameMode" @joinVoice="joinVoice"
		@leaveVoice="properVoiceDisconnect" @gameOver="changeScreen('gameOver')" />
	<GameLeaderboard v-if="state.gameStatus == 'gameOver'" @backToLobby="changeScreen('gameLobby')" />
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, reactive } from 'vue';
import GameNickname from '@/components/game/GameNickname.vue';
import GameLobby from '@/components/game/GameLobby.vue';
import GameLeaderboard from '@/components/game/GameLeaderboard.vue';
import PlayArea from '@/components/game/PlayArea.vue';

import Peer, { MediaConnection } from 'peerjs';
import ws from '@/gateway/websocket';
import { useRoute } from 'vue-router';
import { log } from '@/helpers/logger';
import { getAudio } from '@/helpers/utility';
import { GameService } from '@/services/game';
import { setupIceServer } from '@/gateway/ice';
import { useDesignStore } from '@/stores/design.store';
import { redirect, stopStreams } from '@/helpers/utility';

const designStore = useDesignStore();
const route = useRoute();

let peer: Peer;
const state = reactive({
	gameMode: '',
	gameStatus: 'getNickname',
	localStream: null,
	receivedCalls: [],
	playersInVoice: [] as string[],
	peers: [] as MediaConnection[]
});

function changeScreen(screen: string): void {
	switch (screen) {
		case 'playArea':
			designStore.showBanner = false;
			break;
		case 'gameOver':
			designStore.showBanner = true;
			break;
	}

	state.gameStatus = screen;
}

function startGame(mode: string) {
	state.gameMode = mode;
	changeScreen('playArea');
}

function joinVoice() {
	ws.emit('JOIN_VOICE');
}

function leaveVoice() {
	ws.emit('LEAVE_VOICE');
}

function receiveAudioStream(stream: MediaStream) {
	const audio = document.createElement('audio');
	audio.srcObject = stream;
	audio.addEventListener('loadedmetadata', () => audio.play());
}

function properVoiceDisconnect() {
	leaveVoice();

	if (state.localStream) stopStreams(state.localStream);
	state.receivedCalls.forEach((stream) => stopStreams(stream));

	if (peer) {
		peer.disconnect();
		state.localStream = null;

		if (state.peers) {
			state.peers.forEach((p: any) => p.close());
			state.peers = [];
		}
	}
}

ws.on('PLAYERS_IN_VOICE', (data) => {
	state.playersInVoice = data;
});

ws.on('ADDING_TO_VOICE', (user) => {
	state.playersInVoice.push(user);
});

ws.on('REMOVING_FROM_VOICE', (user) => {
	state.playersInVoice = state.playersInVoice.filter((id) => id !== user);
});

ws.on('VOICE_TOKEN', (data) => {
	let peerPayload = setupIceServer(data);

	getAudio()
		.then((localStream: MediaStream | null) => {
			state.localStream = localStream;

			peer = new Peer(ws.id, peerPayload);

			peer.on('call', (call) => {
				log('info', 'Received call');
				call.answer(state.localStream);
				call.on('stream', (stream) => {
					receiveAudioStream(stream);
					state.receivedCalls.push(stream);
				});
			});

			peer.on('open', () => {
				log('success', 'Connected to peer server');

				let otherPlayersInVoice = state.playersInVoice.filter(
					(id) => id !== ws.id
				);

				state.peers = otherPlayersInVoice.map((id) => {
					var mediaConnection = peer.call(id, state.localStream);
					log('info', `Calling ${id}`);

					const audio = document.createElement('audio');
					mediaConnection.on('stream', (stream) => {
						log('info', `${id} answered call`);
						audio.srcObject = stream;
						audio.addEventListener('loadedmetadata', () => {
							audio.play();
						});
					});

					mediaConnection.on('close', () => audio.remove());

					return mediaConnection;
				});
			});
		})
		.catch((error) => {
			log('error', `Error while fetching audio: ${error}`);
		});
});

onBeforeMount(async () => {
	let game = await GameService.getGame(route.params.id);
	if (!game) redirect('404');
});

ws.on('GAME_NOT_FOUND', () => redirect('404'));
ws.on('HOST_DISCONNECT', () => redirect('join'));

onBeforeUnmount(() => {
	properVoiceDisconnect();

	ws.emit('PLAYER_LEAVE');

	designStore.showBanner = true;

	ws.off('GAME_NOT_FOUND');
	ws.off('HOST_DISCONNECT');
	ws.off('PLAYERS_IN_VOICE');
	ws.off('ADDING_TO_VOICE');
	ws.off('REMOVING_FROM_VOICE');
	ws.off('VOICE_TOKEN');
});
</script>
