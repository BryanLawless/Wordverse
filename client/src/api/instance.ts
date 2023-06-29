import axios from 'axios';
import { BACKEND_URL } from '@/constants/config.js';

/* Enable the use of credentials with axios */
axios.defaults.withCredentials = true;

/* Create an axios instance */
const instance = axios.create({
	baseURL: BACKEND_URL + 'api/',
	headers: { 'Content-Type': 'application/json' },
	validateStatus: (status) => {
		return status >= 200 && status < 500;
	}
});

export default instance;
