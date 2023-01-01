import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			email: '',
			username: '',
			token: useLocalStorage('token', '')
		}
	},
	actions: {
		/*getCurrent() {
			UserService.getCurrent().then((response) => {
				this.email = response.data.email;
				this.username = response.data.username;
			}).catch((error) => {
				console.log("Get user error: ", error);
			});
		},*/
		hasToken() {
			return this.token.length > 0;
		}

	}
});
