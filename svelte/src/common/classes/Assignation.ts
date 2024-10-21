import { Role } from "./Role";
import { Permission } from "./Permission";
import { Chat } from "./Chat";
import { User } from "./User";
import { APIObject } from "./APIObject";

export class Assignment extends APIObject {
	/**
	 * @var {Role|null} role Role of the assignment
	 * @see {@link Role}
	 */
	private role: Role | null;
	/**
	 * @var {Permission|null} permission Permission of the assignment
	 * @see {@link Permission}
	 */
	private permission: Permission | null;
	/**
	 * @var {Chat|null} chat Chat related to the assignment
	 * @see {@link Chat}
	 */
	private chat: Chat | null;
	/**
	 * @var {User} user User related to the assignment
	 * @see {@link User}
	 */
	private user: User | null;

	/**
	 * Create an Assignment object to manipulate
	 *
	 * @param {number | null} id Identifier of the assignment
	 * @param {Role | null} role Role of the assignment
	 * @param {Permission | null} permission Permission of the assignment
	 * @param {Chat | null} chat Chat of the assignment
	 * @param {User | null} user User of the assignment
	 */
	public constructor(
		id: number | null = null,
		role: Role | null = null,
		permission: Permission | null = null,
		chat: Chat | null = null,
		user: User | null = null
	) {
		super(id);
		this.role = role;
		this.permission = permission;
		this.chat = chat;
		this.user = user;
	}

	/**
	 * Set the role of the assignment
	 *
	 * @param {Role} role New role of the assignment
	 *
	 * @returns {void}
	 */
	public setRole(role: Role | null): void {
		this.role = role;
	}

	/**
	 * Get the role of the assignment
	 *
	 * @returns {Role} Role of the assignment
	 */
	public getRole(): Role | null {
		return this.role;
	}

	/**
	 * Set the permission of the assignment
	 *
	 * @param {Permission} permission New permission of the assignment
	 *
	 * @returns {void}
	 */
	public setPermission(permission: Permission | null): void {
		this.permission = permission;
	}

	/**
	 * Get the permission of the assignment
	 *
	 * @returns {Permission} Permission of the assignment
	 */
	public getPermission(): Permission | null {
		return this.permission;
	}

	/**
	 * Set the chat of the assignment
	 *
	 * @param {Chat} chat New chat of the assignment
	 *
	 * @returns {void}
	 */
	public setChat(chat: Chat | null): void {
		this.chat = chat;
	}

	/**
	 * Get the chat of the assignment
	 *
	 * @returns {Chat} Chat of the assignment
	 */
	public getChat(): Chat | null {
		return this.chat;
	}

	/**
	 * Set the user of the assignment
	 *
	 * @param {User} user New user of the assignment
	 *
	 * @returns {void}
	 */
	public setUser(user: User | null): void {
		this.user = user;
	}

	/**
	 * Get the user of the assignment
	 *
	 * @returns {User} User of the assignment
	 */
	public getUser(): User | null {
		return this.user;
	}

	/**
	 * Convert the Assignment object to a string
	 *
	 * @returns {string} Textual representation of the Assignment object
	 */
	public toString(): string {
		let string = `Assignment `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.role) {
			string += `[role=${this.role.toString()}]`;
		}
		if (this.permission) {
			string += `[permission=${this.permission.toString()}]`;
		}
		if (this.chat) {
			string += `[chat=${this.chat.toString()}]`;
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
		if (object.role) {
			const newRole = new Role();
			newRole.hydrateFromObject(object.role);
			object.role = newRole;
		}
		if (object.permission) {
			const newPermission = new Permission();
			newPermission.hydrateFromObject(object.permission);
			object.permission = newPermission;
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
		this.role = object.role ?? null;
		this.permission = object.permission ?? null;
		this.chat = object.chat ?? null;
		this.user = object.user ?? null;
	}

	/**
	 * Convert the Assignment object to a JSON object
	 *
	 * @returns {any} JSON object suitable for API submission
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.role) {
			json.role = this.role.getIRI();
		}
		if (this.permission) {
			json.permission = this.permission.getIRI();
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
