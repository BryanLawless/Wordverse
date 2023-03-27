/**
 * Receive a configuration object for an ICE server
 * @param {Object} twilioPayload The payload with credentials from Twilio
 * @returns {Object: {config: {iceServers: Array}}} The ICE server configuration
 */
export function setupIceServer(twilioPayload) {
	return {
		config: {
			iceServers: [
				{
					url: "turn:global.turn.twilio.com:3478?transport=udp",
					username: twilioPayload.username,
					urls: "turn:global.turn.twilio.com:3478?transport=udp",
					credential: twilioPayload.credential
				},
				{
					url: "turn:global.turn.twilio.com:3478?transport=tcp",
					username: twilioPayload.username,
					urls: "turn:global.turn.twilio.com:3478?transport=tcp",
					credential: twilioPayload.credential
				},
				{
					url: "turn:global.turn.twilio.com:443?transport=tcp",
					username: twilioPayload.username,
					urls: "turn:global.turn.twilio.com:443?transport=tcp",
					credential: twilioPayload.credential
				}
			]
		}
	};
}
