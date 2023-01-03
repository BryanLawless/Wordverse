<template>
	<div class="container">
		<h1 class="heading-effect">
			<span class="main-text">Word</span>
			<span class="heading-effect-invert">verse</span>
		</h1>
		<div class="box box-gradient">
			<div class="inner-box">
				<div class="hexagon">
					<span class="main-letter">W</span>
				</div>
			</div>
		</div>
		<Button @click="redirect('join')" text="Play" icon="fa-solid fa-arrow-right" size="large" />
	</div>
</template>

<script setup>
import Button from '@/components/Button.vue';
import { redirect } from '@/helpers/Utility';
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

.box {
	padding: 2rem;
	border-radius: 5rem;
	animation: pulsing 0.9s ease-in-out alternate infinite;
}

.inner-box {
	padding: 1rem;
	border-radius: 5rem;
	background-color: #eb8efd;
}

.hexagon {
	height: 20rem;
	width: 20rem;
	color: #000;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #fefb75;
	clip-path: polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%);
}

.hexagon .main-letter {
	font-size: 10rem;
	font-weight: 900;
	color: #841449;
}

.main-text {
	margin-right: 7px;
}

@keyframes pulsing {
	from {
		transform: scale(1);
	}

	to {
		transform: scale(1.04);
	}
}
</style>