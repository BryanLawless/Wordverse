/**
 * Log a message to the console with a style
 * @param {string} mode The style of the log message
 * @param {string} message The message to log
 */
export function log(mode: string, message: string) {
	switch (mode) {
		case 'info':
			console.log(
				`%c${message}`,
				'color: #fff; background: #1e88e5; padding: 2px 4px; border-radius: 3px;'
			);
			break;
		case 'success':
			console.log(
				`%c${message}`,
				'color: #fff; background: #43a047; padding: 2px 4px; border-radius: 3px;'
			);
			break;
		case 'warning':
			console.log(
				`%c${message}`,
				'color: #fff; background: #fdd835; padding: 2px 4px; border-radius: 3px;'
			);
			break;
		case 'error':
			console.log(
				`%c${message}`,
				'color: #fff; background: #e53935; padding: 2px 4px; border-radius: 3px;'
			);
			break;
		default:
			console.log(message);
			break;
	}
}
