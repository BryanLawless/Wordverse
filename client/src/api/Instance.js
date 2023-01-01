import axios from 'axios';
import { BACKEND_URL } from '@/constants/Config';

axios.defaults.withCredentials = true;

const instance = axios.create({
	baseURL: BACKEND_URL + 'api/',
	headers: { 'Content-Type': 'application/json' },
	validateStatus: (status) => {
		return status >= 200 && status < 500
	},
});

export default instance;