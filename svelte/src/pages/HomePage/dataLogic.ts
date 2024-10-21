import { Chat } from "../../common/classes/Chat";
import { User } from "../../common/classes/User";
import * as api from "../../common/tools/_api";
import { Assignation } from "../../common/classes/Assignation";
import { Role } from "../../common/classes/Role";
import { Permission } from "../../common/classes/Permission";

/**
 * Retrieves the Chats of the connected user
 *
 * @returns {Promise<Chat[]>} List of Chats of the connected user
 */
export async function getUserChats(user: User): Promise<Chat[]> {
	let chatList: Chat[] = [];

	// We are looking to retrieve only the chats where the user is assigned
	const assignationsArray = await api.getDataByFilter(Assignation.ENDPOINT, {
		user: user.getId(),
	});
	// We retrieve the chat of each assignation
	chatList = assignationsArray.map((assignation: any) => {
		const newAssignation = new Assignation();
		newAssignation.hydrateFromObject(assignation);
		return newAssignation.getChat();
	});
	// We do not want to keep duplicates (if the user is assigned multiple times with multiple roles to the same chat)
	chatList = chatList.filter(
		(chat: Chat, index: number, self: Chat[]) =>
			self.findIndex((c: Chat) => c.getId() === chat.getId()) === index
	);

	return chatList;
}

/**
 * Create a chat
 *
 * @param {string} name Name of the chat to create
 *
 * @returns {Promise<Chat>} Created chat
 */
export async function createChat(user: User, name: string): Promise<Chat> {
	let chat: Chat = new Chat(null, name, [], []);

	// Check if a chat already exists with the same name (case insensitive)
	const chatList = await api.getDataByFilter(Chat.ENDPOINT, { name: name });
	const existingChat = chatList.find(
		(chat: any) => chat.name.toLowerCase() === name.toLowerCase()
	);
	if (existingChat) {
		throw new Error("A chat with this name already exists");
	}
	const createdChat = await chat.sendToAPI();
	if (!createdChat) {
		throw new Error("A server-side error occurred");
	}
	chat = new Chat();
	chat.hydrateFromObject(createdChat);

	// Assign the creator user to the chat
	const assignation = new Assignation(
		null,
		Role.TYPE.ADMIN,
		Permission.TYPE.ALLOWED,
		chat,
		user
	);
	const createdAssignation = await assignation.sendToAPI();
	if (!createdAssignation) {
		throw new Error("Unable to assign the creator user to the chat");
	}

	const assignationObject = new Assignation();
	console.log(
		"Hydrating the assignation with the created object",
		createdAssignation
	);
	assignationObject.hydrateFromObject(createdAssignation);

	chat.setAssignations([assignationObject]);

	return chat;
}

/**
 * Remove a user's assignation from a chat
 *
 * @param {Chat} chat The chat from which the assignation should be removed
 * @param {User} user The user whose assignation should be removed
 *
 * @returns {Promise<boolean>} A promise resolving to true if the assignation was removed, false if the user does not belong to the chat
 *
 * @throws {Error} If an error occurs while removing the assignation
 */
export async function removeChatUser(chat: Chat, user: User): Promise<boolean> {
	// Retrieve the assignation of the concerned user for the concerned chat
	const assignationsArray = await api.getDataByFilter(Assignation.ENDPOINT, {
		user: user.getId(),
		chat: chat.getId(),
	});

	// Check if the user is indeed assigned to the concerned chat
	const assignation = assignationsArray.find(
		(assignation: any) => assignation.chat.id === chat.getId()
	);
	if (!assignation) {
		return false;
	}

	// Remove the assignation
	await api.deleteData(Assignation.ENDPOINT, assignation.id);
	return true;
}
