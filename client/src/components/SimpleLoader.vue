<template>
	<div class="loading"></div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.loading {
	display: inline-block;
	width: 50px;
	height: 50px;
	border: 4px solid #8141cc;
	border-radius: 50%;
	border-top-color: #feeb75;
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