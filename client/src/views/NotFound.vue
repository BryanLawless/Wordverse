<template>
	<div class="container">
		<div class="container">
			<h1>404 Not Found</h1>
			<Button @click="redirect('home')" text="Go Home" size="large" />
		</div>
	</div>
</template>

<script setup>
import { redirect } from '@/helpers/Utility';
import Button from '@/components/Button.vue';
</script>