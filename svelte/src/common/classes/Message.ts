import { APIObject } from "./APIObject";
import { Chat } from "./Chat";
import { User } from "./User";

export class Message extends APIObject {
	/**
	 * @var {string | null} content Message content
	 */
	private content: string | null;
	/**
	 * @var {Date | null} postDate Message post date
	 */
	private postDate: Date | null;
	/**
	 * @var {Chat | null} chat Chat related to the message
	 */
	private chat: Chat | null;
	/**
	 * @var {User | null} user User who posted the message
	 */
	private user: User | null;

	/**
	 * Create a Message object to manipulate
	 *
	 * @param {number | null} id Message identifier
	 * @param {string | null} content Message content
	 * @param {Date | null} postDate Message post date
	 * @param {Chat | null} chat Chat related to the message
	 * @param {User | null} user User who posted the message
	 */
	public constructor(
		id: number | null = null,
		content: string | null = null,
		postDate: Date | null = null,
		chat: Chat | null = null,
		user: User | null = null
	) {
		super(id);
		this.content = content;
		this.postDate = postDate;
		this.chat = chat;
		this.user = user;
	}

	/**
	 * Set the message content
	 *
	 * @param  {string | null} content New message content
	 *
	 * @returns {void}
	 */
	public setContent(content: string | null): void {
		this.content = content;
	}

	/**
	 * Get the message content
	 *
	 * @returns {string | null} Message content
	 */
	public getContent(): string | null {
		return this.content;
	}

	/**
	 * Set the message post date
	 *
	 * @param {Date | null} postDate New message post date
	 *
	 * @returns {void}
	 */
	public setPostDate(postDate: Date | null): void {
		this.postDate = postDate;
	}

	/**
	 * Get the message post date
	 *
	 * @returns {Date | null} Message post date
	 */
	public getPostDate(): Date | null {
		return this.postDate;
	}

	/**
	 * Set the chat related to the message
	 *
	 * @param {Chat | null} chat New chat related to the message
	 *
	 * @returns {void}
	 */
	public setChat(chat: Chat | null): void {
		this.chat = chat;
	}

	/**
	 * Get the chat related to the message
	 *
	 * @returns {Chat | null} Chat related to the message
	 */
	public getChat(): Chat | null {
		return this.chat;
	}

	/**
	 * Set the user who posted the message
	 *
	 * @param user New user who posted the message
	 */
	public setUser(user: User | null): void {
		this.user = user;
	}

	/**
	 * Get the user who posted the message
	 *
	 * @returns {User | null} User who posted the message
	 */
	public getUser(): User | null {
		return this.user;
	}

	/**
	 * Convert the Message object to a string
	 *
	 * @returns {string} Textual representation of the Message object
	 */
	public toString(): string {
		let string = `Message `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.content) {
			string += `[content=${this.content}]`;
		}
		if (this.postDate) {
			string += `[postDate=${this.postDate.toString()}]`;
		}
		if (this.chat) {
			string += `[chat=${this.chat.toString()}]`;
		}
		if (this.user) {
			string += `[user=${this.user.toString()}]`;
		}
		return string;
	}

	/**
	 * @see APIObject#hydrateFromObject
	 */
	public hydrateFromObject(object: any): void {
		if (!object.id) {
			throw new Error("Unable to hydrate object " + this.constructor.name + ": id not defined");
		}

		// Convert nested objects to their respective types
		if (object.postDate) {
			object.postDate = new Date(object.postDate);
		}
		if (object.chat) {
			const newChat = new Chat();
			newChat.hydrateFromObject(object.chat);
			object.chat = newChat;
		}
		if (object.user) {
			const newUser = new User();
			newUser.hydrateFromObject(object.user);
			object.user = newUser;
		}

		this.id = object.id;
		this.content = object.content ?? null;
		this.postDate = object.postDate ?? null;
		this.chat = object.chat ?? null;
		this.user = object.user ?? null;
	}

	/**
	 * Convert the Message object to a JSON object
	 *
	 * @returns {any} JSON object suitable for API submission
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.content) {
			json.content = this.content;
		}
		if (this.postDate) {
			// FIXME: In some cases, this format does not account for time zone or daylight saving time
			json.postDate = this.postDate.toISOString();
		}
		if (this.chat) {
			json.chat = this.chat.getIRI();
		}
		if (this.user) {
			json.user = this.user.getIRI();
		}
		return json;
	}
}
