// This file is used only for testing purposes and should not be used in the final code.

/**
 * Possible debug levels
 */
export enum Level {
	DISABLED = 0,
	ERROR = 1,
	WARNING = 2,
	INFO = 3,
	DEBUG = 4
}

/**
 * @var {Level} currentLevel Current debug level (see {@link LEVELS})
 */
const currentLevel: Level = Level.INFO;

/**
 * Display or not a message in the console depending on the debug level
 *
 * @param {any} content Content to display (object, string, etc.)
 * @param {level} level Debug level of the message (see {@link LEVELS})
 *
 * @example
 * ```ts
 * // The message will be displayed if the configured debug level is greater than or equal to LEVELS.DEBUG
 * consoleLog("Info message", LEVELS.INFO);
 * ```
 */
export function consoleLog(content: any, level: Level) {
	if (currentLevel === Level.DISABLED) {
		return;
	}
	switch (level) {
		case Level.DEBUG:
			if (currentLevel >= Level.DEBUG) {
				console.log(content);
			}
			break;
		case Level.INFO:
			if (currentLevel >= Level.INFO) {
				console.info(content);
			}
			break;
		case Level.WARNING:
			if (currentLevel >= Level.WARNING) {
				console.warn(content);
			}
			break;
		case Level.ERROR:
			if (currentLevel >= Level.ERROR) {
				console.error(content);
			}
			break;
		case Level.DISABLED:
			break;
		default:
			console.log(content);
	}
}
