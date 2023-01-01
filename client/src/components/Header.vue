<template>
	<header class="header-container">
		<div class="inner-container">
			<h1 class="branding">Dispu<span class="text-highlight">u</span>te</h1>
			<div class="navigation">
				<a @click="redirect('join')" class="nav-link">Join Game</a>
				<a @click="redirect('login')" class="nav-link">Login</a>
				<!--<a @click="redirect('register')" class="btn btn-primary btn-small">Register</a>-->
			</div>
		</div>
	</header>
</template>

<script setup>
import { redirect } from '@/helpers/Utility';
</script>

<style lang="css" scoped>
.branding {
	color: var(--text-primary-color);
}

.header-container {
	display: flex;
	flex-wrap: wrap;
	background: transparent;
	padding: 10px 25px;
	width: 100%;
	z-index: 9;
	border-bottom: 1px solid rgb(232, 232, 232);
	position: fixed;
	top: 0px;
	left: 0px;
	right: 0px;
	align-items: center;
	justify-content: space-between;
}

.header-container .inner-container {
	display: flex;
	align-items: center;
	width: 100%;
	margin-top: 3px;
	margin-bottom: 3px;
	justify-content: space-between;
}

.header-container .inner-container .navigation {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.header-container .inner-container .navigation .nav-link {
	margin: 0px 10px;
	font-weight: bold;
}
</style>