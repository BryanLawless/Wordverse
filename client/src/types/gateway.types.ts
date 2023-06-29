export interface Message {
	from: string;
	message: string;
}

export interface TwilioPayload {
	username: string;
	credential: string;
}

export interface IceServerConfig {
	config: IceServers;
}

export interface IceServers {
	iceServers: Array<IceServer>;
}

export interface IceServer {
	url: string;
	username: string;
	urls: string;
	credential: string;
}
