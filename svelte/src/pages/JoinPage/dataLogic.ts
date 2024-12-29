import { Assignment } from "../../common/classes/Assignment";
import { Chat } from "../../common/classes/Chat";
import { Permission } from "../../common/classes/Permission";
import { Role } from "../../common/classes/Role";
import type { User } from "../../common/classes/User";
import * as api from "../../common/tools/_api";

/**
 * Retrieve the chat based on the identifier
 *
 * @param {number} id Chat identifier
 *
 * @returns {Promise<Chat | null>} The chat or null if not found
 *
 * @throws {Error} Error if the identifier is not a number
 */
export async function getChat(id: number): Promise<Chat | null> {
	if (isNaN(id)) {
		throw new Error("The chat identifier must be a number");
	}
	try {
		const chat: Chat = new Chat(id);
		await chat.hydrateFromAPI();

		return chat;
	} catch (error: any) {
		return null;
	}
}

/**
 * Check if the user is already assigned to a chat
 *
 * @param {User} user User to check
 * @param {Chat} chat Chat to check
 *
 * @returns {Promise<boolean>} True if the user is already assigned, false otherwise
 */
export async function isUserInChat(user: User, chat: Chat): Promise<boolean> {
	const existingAssignments = await api.getDataByFilter(
		Assignment.ENDPOINT,
		{ chat: chat.getId(), user: user.getId() }
	);
	if (existingAssignments !== null && existingAssignments.length > 0) {
		return true;
	}
	return false;
}

/**
 * Add an assignment to a chat for a user
 *
 * @param {User} user User to add
 * @param {Chat} chat Chat to which the user is added
 *
 * @returns {Promise<boolean>} True if the user was added, false if they were already present
 *
 * @throws {Error} Error if the assignment could not be added
 */
export async function joinChat(user: User, chat: Chat): Promise<boolean> {
	const assignment = new Assignment(
		null,
		Role.TYPE.GUEST,
		Permission.TYPE.ALLOWED,
		chat,
		user
	);

	// Check if the user is already assigned to the chat
	const alreadyAssigned = await isUserInChat(user, chat);
	if (alreadyAssigned) {
		return false;
	}

	const data = await assignment.sendToAPI();
	if (data !== null) {
		return true;
	} else {
		throw new Error("The assignment could not be added");
	}
}
