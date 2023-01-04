<template>
	<div class="container">
		<div class="leaderboard-container box-gradient">
			<div class="header">
				<h3 class="title">Top Players</h3>
			</div>
			<div v-for="(player, index) in state.leaderboard.slice(0, 5)" :key="index" class="rest">
				<div class="others flex">
					<div class="rank">
						<i v-if="index + 1 == 1" class="fas fa-crown crown"></i>
						<i v-else class="fas fa-caret-up"></i>
						<p class="num">{{ index + 1 }}</p>
					</div>
					<div class="info flex">
						<p class="link">{{ player.nickname }}</p>
						<p class="points">{{ player.score }}</p>
					</div>
				</div>
			</div>
			<Button @click="redirect('join')" text="Back to Games" icon="fa fa-arrow-left" size="small" />
		</div>
	</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import Button from '@/components/Button.vue';

import { redirect } from '@/helpers/Utility';
import { GameService } from '@/services/Game';

const route = useRoute();

const state = reactive({
	leaderboard: [],
});

async function fetchLeaderboard() {
	let leaderboard = await GameService.getGameLeaderboard(route.params.id);
	if (leaderboard) state.leaderboard = leaderboard.slice(0, 5);
}

onMounted(() => fetchLeaderboard());
</script>

<style lang="css" scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	gap: 3.5rem;
	position: relative;
}

.leaderboard-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	padding: 2rem;
	border-radius: 1rem;
}

.card .header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2rem;
	color: #ddd;
}

.header .title {
	font-weight: 300;
	font-size: 2rem;
}

.one .sort {
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-size: 14.1px;
}

.one .sort .day {
	padding: 0.4rem 1.2rem;
	margin: 0 0.1rem;
	cursor: pointer;
}

.one .sort .day.active,
.one .sort .day:active {
	background: rgba(210, 255, 213, 0.3);
	border-radius: 25px;
}

::selection {
	background: rgba(210, 255, 213, 0.3);
}

.photo {
	width: 75px;
	background: #fff;
	border-radius: 50%;
	border: 5px solid #fefb75;
	box-shadow: 0 0 20px #fefb75;
	margin: 1rem 0;
}

.main {
	width: 85px;
}

.rankings {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 1rem;
	gap: 2rem;
}

.rankings .player {
	display: flex;
	margin: 1rem 0;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.rankings .player.first {
	z-index: 10;
	transform: translateY(-10%);
}

.crown {
	color: gold;
	filter: drop-shadow(0px 0px 5px gold);
}

.num {
	color: white;
	font-size: 1.5rem;
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
}

.second {
	margin-right: -0.7rem !important;
}

.third {
	margin-left: -0.7rem !important;
}

.p_img {
	width: 50px;
	background: #fff;
	border-radius: 50%;
}

.flex {
	display: flex;
	align-items: center;
}

.others {
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: center;
}

.info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-width: 15rem;
	border-radius: 30px;
	background: rgba(210, 213, 255, 0.3);
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