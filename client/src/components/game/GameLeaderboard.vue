<template>
	<div class="flex flex-col items-center justify-center">
		<div class="flex flex-col items-center justify-center gap-4 p-8 leaderboard-container">
			<div class="header">
				<h3 class="text-2xl font-black">Top Players</h3>
			</div>
			<div v-for="(player, index) in state.leaderboard.slice(0, 5)" :key="index" class="rest">
				<div class="others flex">
					<div class="rank">
						<i v-if="index + 1 == 1" class="fas fa-crown crown"></i>
						<i v-else class="fas fa-caret-up"></i>
						<p class="num">{{ index + 1 }}</p>
					</div>
					<div class="flex items-center justify-between info p-4">
						<p class="link">{{ player.nickname }}</p>
						<p class="points">{{ player.score }}</p>
					</div>
				</div>
			</div>
			<Button @click="redirect('join')" text="Back to Lobby" icon="fa fa-arrow-left" size="small" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import Button from '@/components/Button.vue';

import { redirect } from '@/helpers/utility';
import { GameService } from '@/services/game';
import { LeaderboardPlayer } from '@/types/game.types';

const route = useRoute();

const state = reactive({
	leaderboard: [] as LeaderboardPlayer[]
});

async function fetchLeaderboard() {
	let leaderboard = await GameService.getGameLeaderboard(route.params.id);

	let l = leaderboard as any;

	if (l.length > 0) state.leaderboard = l.slice(0, 5);
}

onMounted(() => fetchLeaderboard());
</script>

<style lang="css" scoped>
.leaderboard-container {
	border-radius: 1rem;
	background-color: #15141a;
	border: 0.4rem solid #7d5afa;
}

.crown {
	color: #fefb75;
	text-shadow: 0px 0px 2px #fefb75;
	filter: drop-shadow(0px 0px 5px #fefb75);
}

.num {
	color: white;
	font-size: 1.5rem;
	font-weight: bold;
}

.fa-caret-up {
	color: #fefb75;
	font-size: 1.3rem;
}

.link {
	margin: 0.2rem 0;
	color: #fff;
	margin-top: -0.3rem;
	font-size: 13px;
	font-size: 1rem;
}

.points {
	color: #fefb75;
	font-size: 17px;
	font-weight: bold;
}

.others {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
}

.info {
	min-width: 20rem;
	border-radius: 1rem;
	background: #7d5afa;
}

.info .points {
	margin-left: 0.2rem;
	margin-right: 1.2rem;
}

.info .link {
	margin: 0 1rem;
}

.rank {
	display: flex;
	align-items: center;
	margin: 0 1rem;
	gap: 0.5rem;
	flex-direction: column-reverse;
}

.rank i {
	margin-top: -5px !important;
}

.rank .num {
	margin: 0 !important;
}
</style>
