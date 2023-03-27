<template>
	<div class="container flex flex-col justify-center gap-4 items-center h-screen">
		<h1 class="font-black leading-none">
			<span class="heading-effect">Not </span>
			<span class="heading-effect-other">Found</span>
		</h1>

		<p class="font-semibold text-center w-2/5">
			Hmm, we couldn't find what your were looking for, try checking your
			spelling or practice your spelling in one of our games.
		</p>
		<Button @click="redirect('home')" icon="fa-solid fa-house" text="Go Home" size="medium" />
	</div>
</template>

<script setup>
import { redirect } from "@/helpers/utility";
import Button from "@/components/Button.vue";
</script>
