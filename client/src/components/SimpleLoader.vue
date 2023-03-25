<template>
	<div class="flex flex-row justify-center items-center gap-4 holder">
		<div class="loading"></div>
		<span class="font-semibold uppercase">{{ props.text }}</span>
	</div>
</template>

<script setup>
const props = defineProps({
	text: {
		type: String,
		default: "Loading..."
	}
});
</script>

<style lang="css" scoped>
.holder {
	border-radius: 1rem;
	padding: 1rem 5rem;
	background-color: #7d5afa;
}

.loading {
	display: inline-block;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 4px solid #5b41b7;
	border-top-color: #fefb75;
	animation: spin 1s ease-in-out infinite;
	-webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
	to {
		-webkit-transform: rotate(720deg);
	}
}

@-webkit-keyframes spin {
	to {
		-webkit-transform: rotate(720deg);
	}
}
</style>
