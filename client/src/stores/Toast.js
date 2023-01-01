import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
	state: () => {
		return {
			toasts: []
		}
	},
	actions: {
		addToast(type, title, message = '') {
			this.toasts.push({ title: title, message: message, type: type });
		},
		removeToast(title) {
			const index = this.toasts.findIndex((toast) => toast.title === title);
			this.toasts.splice(index, 1);
		}
	}
});