import io from "socket.io-client";
import { log } from "@/helpers/logger";
import { BACKEND_URL } from "@/constants/config";

/* Create a socket.io instance */
const socket = io(BACKEND_URL, {
	reconnectionDelayMax: 5000
});

/* Listen for any events */
socket.onAny((event, ...args) => {
	log("info", `${event}`);
	/* console.log(JSON.stringify(args)); */
});

export default socket;
