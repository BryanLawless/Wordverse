import router from "@/router/router";
import instance from "@/api/instance";

/**
 * Redirect to a new route
 * @param {String} path The route name to redirect to
 * @param {Object} args Arguments to pass to the next route
 */
export function redirect(path, args) {
	router.push({ name: path, params: args });
}

/**
 * Send data from the service to the controller
 * @param {String} event The event name to send to the controller
 * @param {Object} data The data to send to the controller
 * @returns {Object: {event: String, data: Object}} The event name and the data to send to the controller
 */
export function serviceToView(event, data = {}) {
	return { event: event, data: data };
}

/**
 * Set a delay for a period of milliseconds
 * @param {Integer} ms The number of milliseconds to delay for
 * @returns {Promise} A promise that resolves after the delay
 */
export function delay(ms) {
	return new Promise((resolve) => setTimeout(() => resolve(), ms), ms);
}

/**
 * Apply a fade in effect to an audio element
 * @param {Object} audio The audio element instance to access
 */
export function audioEffectFadeIn(audio) {
	var InT = 0;
	audio.volume = InT;
	var eAudio = setInterval(function () {
		InT += 0.005;
		audio.volume = InT.toFixed(1);
		if (InT.toFixed(1) >= 0.015) clearInterval(eAudio);
	}, 50);
}

/**
 * Convert milliseconds to minutes and seconds
 * @param {Integer} millis The number of milliseconds to convert
 * @returns {Integer} The number of minutes and seconds in the milliseconds
 */
export function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);

	return { minutes: minutes, seconds: (seconds < 10 ? "0" : "") + seconds };
}

/**
 * Get the amount of time remaining until the future timestamp
 * @param {String} endTime A timestamp set in the future
 * @returns {Object: {total: Integer, hours: Integer, minutes: Integer, seconds: Integer}} The time remaining in hours, minutes and seconds
 */
export function getTimeRemaining(endTime) {
	const total = Date.parse(endTime) - Date.parse(new Date());
	const seconds = Math.floor((total / 1000) % 60);
	const minutes = Math.floor((total / 1000 / 60) % 60);
	const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

	return {
		total,
		hours,
		minutes,
		seconds
	};
}

/**
 * Check if the backend API is online
 * @returns {Promise: {status: Integer, response: Object}} The status code and the response from the API
 */
export async function serverOnline() {
	let onlinePromise = await instance
		.get("health", {
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
export function webRtcSupported() {
	return (
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia ||
		window.RTCPeerConnection
	);
}

/**
 * Get the user's audio stream
 * @returns {Promise} A promise that resolves with the user's audio stream
 */
export function getAudio() {
	return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
}

/**
 * Stop all live streams from the user
 * @param {Object} stream The users stream instance
 */
export function stopStreams(stream) {
	stream.getTracks().forEach(function (track) {
		if (track.readyState === "live") track.stop();
	});
}
