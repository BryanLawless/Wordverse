<template>
	<div class="freeze-container"></div>
</template>

<script setup>

</script>

<style lang="css" scoped>
.freeze-container {
	position: fixed;
	padding: 0;
	margin: 0;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999;
	border-radius: 16px;
	background: rgba(146, 219, 255, 0.56);
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
	backdrop-filter: blur(11.7px);
	-webkit-backdrop-filter: blur(11.7px);
}
</style>