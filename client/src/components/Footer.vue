<template>
	<footer class="footer-container">
		<div class="footer-inner-container">
			<div class="footer-content">
				<p>Copyright © {{ new Date().getFullYear() }} Dispuute</p>
			</div>
		</div>
	</footer>
</template>

<script setup>

</script>

<style lang="css" scoped>
footer {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 5rem;
}

footer .footer-inner-container {
	width: 50rem;
	height: inherit;
	background-color: #0087fe;
	border-top-left-radius: 1rem;
	border-top-right-radius: 1rem;
}

footer .footer-inner-container .footer-content {
	display: flex;
	justify-content: center;
	align-items: center;
	height: inherit;
	color: white;
}
</style>