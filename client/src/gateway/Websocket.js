import io from 'socket.io-client'
import { BACKEND_URL } from '@/constants/Config';

const socket = io(BACKEND_URL, {
	reconnectionDelayMax: 5000,
});

socket.onAny((data) => {
	console.log('[Websocket]', data);
});

export default socket;