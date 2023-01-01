import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/Router';

import setupInterceptors from './api/Interceptors';
import { useAuthStore } from './stores/Auth';

import './assets/css/normalize.css';
import './assets/css/base.css';

const pinia = createPinia();

createApp(App)
	.use(pinia)
	.use(router)
	.mount('#app');

const authStore = useAuthStore();
setupInterceptors(authStore);