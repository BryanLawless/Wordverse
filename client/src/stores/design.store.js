import { defineStore } from "pinia";

export const useDesignStore = defineStore("designStore", {
	state: () => {
		return { showBanner: true };
	},
	actions: {
		toggleBanner() {
			this.showBanner = !this.showBanner;
		}
	}
});
