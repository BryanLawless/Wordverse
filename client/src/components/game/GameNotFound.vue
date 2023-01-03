<template>
	<div class="container">
		<h1>Game Not Found</h1>
		<Button @click="redirect('join')" text="Back to Games" size="large" />
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
	gap: 2.5rem;
	position: relative;
}
</style>