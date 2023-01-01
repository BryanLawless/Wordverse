export function setToken(token) {
	localStorage.setItem('token', token);
}

export function removeToken() {
	localStorage.removeItem('token');
}

