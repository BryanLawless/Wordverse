<template>
	<div class="main-container">
		<div class="login-container">
			<h1>Login</h1>
			<p>Dont have an account? <a @click="redirect('register')">Create One</a></p>
			<form @submit.prevent="attemptLogin" class="form-wrapper">
				<input type="text" class="input-field" placeholder="Username" v-model="state.username">
				<input type="password" class="input-field" placeholder="Password" v-model="state.password">

				<button type="submit" class="btn btn-primary btn-large">Login</button>
			</form>
		</div>
	</div>
</template>

<script setup>
import { reactive } from 'vue';

import { redirect } from '@/helpers/Utility';
import { AuthService } from '@/services/Auth';
import { useToastStore } from '@/stores/Toast';

const toastStore = useToastStore();

const state = reactive({
	username: '',
	password: '',
});

async function attemptLogin() {
	let { event, data } = await AuthService.login(state.username, state.password);
	console.log(event, data)
	switch (event) {
		case 'ERR_REGISTER_FAILED':
			toastStore.addToast('error', 'Invalid login details.');
			break;
		case 'SUCCESS_LOGIN':
			toastStore.addToast('info', 'Welcome back!');
			break;
		default:
			toastStore.addToast('error', 'Unknown Error.');
			break;
	}
}
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

.main-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	position: relative;
}

.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 20rem;
	height: 22rem;
}

.login-container .form-wrapper {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
}
</style>