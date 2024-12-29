import { Chat } from "../../common/classes/Chat";
import * as api from "../../common/tools/_api";

/**
 * Retrieves existing chats
 *
 * @returns {Promise<Chat[]>} List of existing chats
 */
export async function getChats(): Promise<Chat[]> {
	let chatList: Chat[] = [];
	// Retrieve all chats (0 = all chats)
	chatList = await api.getDataById(Chat.ENDPOINT, 0);
	chatList = chatList.map((chat: any) => {
		const newChat = new Chat();
		newChat.hydrateFromObject(chat);
		return newChat;
	});
	return chatList;
}
