<template>
	<div class="main-container">
		<div class="register-container">
			<h1>Create an account</h1>
			<p>Already have an account? <a @click="redirect('login')">Login</a></p>
			<form @submit.prevent="attemptRegister" class="form-wrapper">
				<input type="text" class="input-field" placeholder="Email" v-model="state.email">
				<input type="text" class="input-field" placeholder="Username" v-model="state.username">
				<input type="password" class="input-field" placeholder="Password" v-model="state.password">
				<input type="password" class="input-field" placeholder="Confirm Password"
					v-model="state.confirmPassword">
				<p class="terms">By creating an account, you agree to our <a href="#">Terms</a> and <a href="#">Privacy
						Policy</a>.
				</p>

				<button type="submit" class="btn btn-primary btn-large">Create</button>
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
	email: '',
	username: '',
	password: '',
	confirmPassword: '',
});

async function attemptRegister() {
	let { event } = await AuthService.register(state.email, state.username, state.password, state.confirmPassword);
	switch (event) {
		case 'ERR_REGISTER_INVALID_INPUT':
			toastStore.addToast('error', 'Invalid input', 'Invalid input description.');
		case 'ERR_REGISTER_EMAIL_EXISTS':
			toastStore.addToast('error', 'Email already exists.');
			break;
		case 'ERR_REGISTER_USERNAME_EXISTS':
			toastStore.addToast('error', 'Username already exists.');
			break;
		case 'SUCCESS_REGISTER':
			toastStore.addToast('success', 'Welcome to Dispute!');
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

.register-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 20rem;
	height: 35rem;
}

.register-container .form-wrapper {
	display: flex;
	justify-content: space-around;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.terms {
	text-align: center;
}
</style>