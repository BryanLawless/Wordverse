<template>
	<div class="container">
		<h1 class="heading-effect">Word<span class="heading-effect-invert">verse</span></h1>
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
.box {
	padding: 2rem;
	border-radius: 5rem;
	transform: rotate(10deg);
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
	background-image: linear-gradient(180deg, #551212, #841449);
	background-size: 100%;
	background-repeat: repeat;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
}

button {
	background: #fefb75;
	padding: 1.5rem 5rem;
	border-radius: 5rem;
	text-transform: uppercase;
	font-size: 1.5rem;
	border: 4px solid #b95e95;
	cursor: pointer;
	color: #5d121c;
}
</style>