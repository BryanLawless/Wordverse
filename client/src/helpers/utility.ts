import router from '@/router/router';
import instance from '@/api/instance';
import { RouteParamsRaw } from 'vue-router';

/**
 * Redirect to a new route
 * @param {String} path The route name to redirect to
 * @param {RouteParamsRaw} args Arguments to pass to the next route
 */
export function redirect(path: string, args: RouteParamsRaw = {}) {
	router.push({ name: path, params: args });
}

/**
 * Send data from the service to the controller
 * @param {String} event The event name to send to the controller
 * @param {Object} data The data to send to the controller
 * @returns {Object: {event: String, data: Object}} The event name and the data to send to the controller
 */
export function serviceToView(
	event: string,
	data: object = {}
): { event: string; data: object } {
	return { event: event, data: data };
}

/**
 * Set a delay for a period of milliseconds
 * @param {Number} ms The number of milliseconds to delay for
 * @returns {Promise} A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

/**
 * Convert milliseconds to minutes and seconds
 * @param {Number} ms The number of milliseconds to convert
 * @returns {Number} The number of minutes and seconds in the milliseconds
 */
export function millisToMinutesAndSeconds(ms: number): {
	minutes: number;
	seconds: string;
} {
	var minutes = Math.floor(ms / 60000);
	var seconds = Number(((ms % 60000) / 1000).toFixed(0));

	return { minutes: minutes, seconds: (seconds < 10 ? '0' : '') + seconds };
}

/**
 * Get the amount of time remaining until the future timestamp
 * @param {String} endTime A timestamp set in the future
 * @returns {Object: {total: Number, hours: Number, minutes: Number, seconds: Number}} The time remaining in hours, minutes and seconds
 */
export function getTimeRemaining(endTime: string): {
	total: number;
	hours: number;
	minutes: number;
	seconds: number;
} {
	const total = Date.parse(endTime) - Date.parse(new Date().toString());
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

	return {
		total: total,
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
}

/**
 * Check if the backend API is online
 * @returns {Promise<Boolean>} The status code and the response from the API
 */
export async function serverOnline(): Promise<boolean> {
	let onlinePromise = await instance
		.get('health', {
			timeout: 2000
		})
		.then(() => {
			return true;
		})
		.catch(() => {
			return false;
		});

	return onlinePromise;
}

/**
 * Check if the browser supports the WebRTC protocol
 * @returns {Boolean} Whether the browser supports WebRTC
 */
export function webRtcSupported(): boolean {
	const n = navigator as any;

	return (
		n.getUserMedia ||
		n.webkitGetUserMedia ||
		n.mozGetUserMedia ||
		n.msGetUserMedia ||
		window.RTCPeerConnection
	);
}

/**
 * Get the user's audio stream
 * @returns {Promise<MediaStream>} A promise that resolves with the user's audio stream
 */
export function getAudio(): Promise<MediaStream> {
	return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
}

/**
 * Stop all live streams from the user
 * @param {Object} stream The users stream instance
 */
export function stopStreams(stream: MediaStream) {
	stream.getTracks().forEach(function (track) {
		if (track.readyState === 'live') track.stop();
	});
}
