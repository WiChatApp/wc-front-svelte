/**
 * Properties of a notification
 */
export interface NotificationProps {
	message: string;
	type: NotificationType;
}

/**
 * Possible notification types
 */
export type NotificationType = "info" | "success" | "warning" | "error";
