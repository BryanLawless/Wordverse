import { TwilioPayload, IceServerConfig } from '@/types/gateway.types';

/**
 * Receive a configuration object for an ICE server
 * @param {object} twilioPayload The payload with credentials from Twilio
 * @returns {IceServerConfig} The ICE server configuration
 */

export function setupIceServer(twilioPayload: TwilioPayload): IceServerConfig {
	return {
		config: {
			iceServers: [
				{
					url: 'turn:global.turn.twilio.com:3478?transport=udp',
					username: twilioPayload.username,
					urls: 'turn:global.turn.twilio.com:3478?transport=udp',
					credential: twilioPayload.credential
				},
				{
					url: 'turn:global.turn.twilio.com:3478?transport=tcp',
					username: twilioPayload.username,
					urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
					credential: twilioPayload.credential
				},
				{
					url: 'turn:global.turn.twilio.com:443?transport=tcp',
					username: twilioPayload.username,
					urls: 'turn:global.turn.twilio.com:443?transport=tcp',
					credential: twilioPayload.credential
				}
			]
		}
	};
}
