import instance from './Instance';

export default async function request(uri, method, data = {}) {
	let requestPromise = await instance.request({
		method: method,
		url: uri,
		data: data
	}).then((response) => {
		return { status: response.status, response: response.data };
	}).catch((error) => {
		return { status: error.response.status, response: error.response.data };
	});

	return requestPromise;
}