import instance from './Instance';

const setup = (authStore) => {
	instance.interceptors.request.use(
		(config) => {
			if (authStore.hasToken()) config.headers.Authorization = `Bearer ${authStore.token}`;

			return config;
		}, (error) => {
			return Promise.reject(error);
		}
	);

	instance.interceptors.response.use((res) => { return res }, async (err) => {
		const originalRequest = err.config;

		if (originalRequest.url !== '/auth/login' || originalRequest.url !== '/auth/register' && err.response) {
			if (err.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;

				try {
					console.log("If you are seeing this, you have found an upcoming beta feature!")

					return instance(originalRequest);
				} catch (_error) {
					return Promise.reject(_error);
				}
			}
		}

		return Promise.reject(err);
	});
};

export default setup;