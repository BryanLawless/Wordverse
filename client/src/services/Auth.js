import request from '@/api/Request';
import { serviceToView } from '@/helpers/Utility';
import { setToken, removeToken } from '@/helpers/Token';

export class AuthService {

	static async login(email, password) {
		const { status, response } = await request('auth/login', 'POST', {
			email: email,
			password: password
		});

		switch (status) {
			case 400:
				return serviceToView('ERR_REGISTER_FAILED');
			case 422:
				return serviceToView('ERR_LOGIN_INVALID_INPUT', response.data);
			case 200:
				setToken(response.data.auth.token);
				return serviceToView('SUCCESS_LOGIN', response.data);
			default:
				return serviceToView('UNKNOWN_LOGIN');
		}
	}

	static async register(email, username, password, confirm_password) {
		const { status, response } = await request('/auth/login', 'POST', {
			email: email,
			username: username,
			password: password,
			confirm_password: confirm_password,
		});

		switch (status) {
			case 422:
				return serviceToView('ERR_REGISTER_INVALID_INPUT', response.data);
			case 409:
				return serviceToView('ERR_REGISTER_EMAIL_EXISTS');
			case 200:
				setToken(response.data.auth.token);
				return serviceToView('SUCCESS_REGISTER', response.data);
			default:
				return serviceToView('UNKNOWN_REGISTER');
		}
	}
}