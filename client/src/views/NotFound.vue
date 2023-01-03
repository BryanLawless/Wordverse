<template>
	<div class="container">
		<h1>404 Not Found</h1>
		<Button @click="redirect('home')" text="Go Home" size="large" />
	</div>
</template>

<script setup>
import { redirect } from '@/helpers/Utility';
import Button from '@/components/Button.vue';
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
</style>