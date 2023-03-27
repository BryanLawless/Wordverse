<template>
	<div class="flex flex-row items-start justify-start">
		<Button
			@click="emit('pageChange', 'back')"
			icon="fa-solid fa-arrow-left"
			size="large" />
	</div>
</template>

<script setup>
import Button from "./Button.vue";

const emit = defineEmits(["pageChange"]);
</script>

<style lang="css" scoped></style>
