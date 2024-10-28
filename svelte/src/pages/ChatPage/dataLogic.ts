import { Chat } from "../../common/classes/Chat";
import { Message } from "../../common/classes/Message";
import { User } from "../../common/classes/User";
import * as api from "../../common/tools/_api";

/**
 * Retrieve the chat by its identifier
 *
 * @param {number} id Identifier of the chat
 *
 * @returns {Promise<Chat | null>} The chat or null if not found
 */
export async function getChat(id: number): Promise<Chat | null> {
	let chat: Chat | null = null;

	// If we try to retrieve a non-existent chat by its id rather than by a filter,
	// the server generates a 404 error and an error is raised
	// Therefore, we prefer to use a filter
	const chatData = await api.getDataByFilter(Chat.ENDPOINT, { id: id });
	if (chatData[0]) {
		chat = new Chat();
		chat.hydrateFromObject(chatData[0]);
	}

	return chat;
}

/**
 * Send a message in a chat
 *
 * @param {User} user User sending the message
 * @param {Chat} chat Chat in which to send the message
 * @param {string} message Message to send
 *
 * @returns {Promise<boolean>} true if the message was sent, false otherwise
 */
export async function sendMessage(
	user: User,
	chat: Chat,
	message: string
): Promise<boolean> {
	const msgToSend = new Message(null, message, new Date(), chat, user);
	let success = false;

	const createdMsg = await msgToSend.sendToAPI();
	if (createdMsg !== null) {
		success = true;
	} else {
		success = false;
	}

	return success;
}
