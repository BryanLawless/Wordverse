import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router/router';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import './assets/css/base.css';

const pinia = createPinia();

createApp(App)
	.use(pinia)
	.use(router)
	.use(Toast, { maxToasts: 5, newestOnTop: true })
	.mount('#app');
