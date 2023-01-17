import router from '@/router/Router';
import instance from '@/api/Instance';

export function redirect(path, args) {
	router.push({ name: path, params: args });
}

export function serviceToView(event, data = {}) {
	return { event: event, data: data };
}

export function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	}, ms);
}

export function audioEffectFadeIn(audio) {
	var InT = 0;
	audio.volume = InT;
	var eAudio = setInterval(function () {
		InT += 0.005;
		audio.volume = InT.toFixed(1);
		if (InT.toFixed(1) >= 0.7) clearInterval(eAudio);
	}, 50);
}

export function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);

	return { minutes: minutes, seconds: (seconds < 10 ? '0' : '') + seconds }
}

export function getTimeRemaining(endtime) {
	const total = Date.parse(endtime) - Date.parse(new Date());
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

export async function serverOnline() {
	let onlinePromise = await instance.get('health', {
		timeout: 30000
	}).then(() => {
		return true;
	}).catch(() => {
		return false;
	});

	return onlinePromise;
}

export function webRtcSupported() {
	return navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia ||
		window.RTCPeerConnection;
}
