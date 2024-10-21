import { Message } from "./Message";
import { APIObject } from "./APIObject";
import { Assignation } from "./Assignation";

export class Chat extends APIObject {
	/**
	 * @var {string | null} name Chat name
	 */
	private name: string | null;
	/**
	 * @var {Message[]|null} messages Chat messages
	 * @see {@link Message}
	 */
	private messages: Message[] | null;
	/**
	 * @var {Assignation[]|null} assignations Chat assignations
	 * @see {@link Assignation}
	 */
	private assignations: Assignation[] | null;

	/**
	 * Create a Chat object to manipulate
	 *
	 * @param {number | null} id Chat identifier
	 * @param {string|null} name Chat name
	 * @param {Message[]|null} messages Chat messages
	 * @param {Assignation[]|null} assignations Chat assignations
	 */
	public constructor(
		id: number | null = null,
		name: string | null = null,
		messages: Message[] | null = null,
		assignations: Assignation[] | null = null
	) {
		super(id);
		this.name = name;
		// Sort by postDate
		if (messages !== null) {
			messages.sort((a, b) => {
				if (a.getPostDate() && b.getPostDate()) {
					const dateA = a.getPostDate();
					const dateB = b.getPostDate();
					if (dateA && dateB) {
						return dateA.getTime() - dateB.getTime();
					}
				}
				return 0;
			});
		}
		this.messages = messages;
		this.assignations = assignations;
	}

	/**
	 * Set the chat name
	 *
	 * @param {string | null} name New chat name
	 *
	 * @returns {void}
	 */
	public setName(name: string | null): void {
		this.name = name;
	}

	/**
	 * Get the chat name
	 *
	 * @returns {string | null} Chat name
	 */
	public getName(): string | null {
		return this.name;
	}

	/**
	 * Add a message to the chat
	 *
	 * @param {Message} message Message to add
	 *
	 * @throws {Error} The chat messages array is not initialized
	 *
	 * @returns {void}
	 */
	public addMessage(message: Message): void {
		if (!this.messages) {
			throw new Error(
				"Cannot add a message: The chat messages array is not initialized"
			);
		}
		this.messages.push(message);
	}

	/**
	 * Remove a message from the chat
	 *
	 * @param {Message} message Message to remove
	 *
	 * @throws {Error} The chat messages array is not initialized
	 *
	 * @returns {void}
	 */
	public removeMessage(message: Message): void {
		if (!this.messages) {
			throw new Error(
				"Cannot remove a message: The chat messages array is not initialized"
			);
		}
		const index = this.messages.indexOf(message);
		if (index !== -1) {
			this.messages.splice(index, 1);
		}
	}

	/**
	 * Clear the chat messages
	 *
	 * @throws {Error} The chat messages array is not initialized
	 *
	 * @returns {void}
	 */
	public clearMessages(): void {
		if (!this.messages) {
			throw new Error(
				"Cannot clear messages: The chat messages array is not initialized"
			);
		}
		this.messages = [];
	}

	/**
	 * Set the chat messages
	 *
	 * @param {Message[]|null} messages New chat messages or null to not initialize the array
	 *
	 * @returns {void}
	 */
	public setMessages(messages: Message[] | null): void {
		this.messages = messages;
	}

	/**
	 * Get the chat messages
	 *
	 * @returns {Message[]|null} Chat messages or null if the array is not initialized
	 */
	public getMessages(): Message[] | null {
		return this.messages;
	}

	/**
	 * Add an assignation to the chat
	 *
	 * @param {Assignation} assignation Assignation to add
	 *
	 * @throws {Error} The chat assignations array is not initialized
	 */
	public addAssignation(assignation: Assignation): void {
		if (!this.assignations) {
			throw new Error(
				"Cannot add an assignation: The chat assignations array is not initialized"
			);
		}
		this.assignations.push(assignation);
	}

	/**
	 * Remove an assignation from the chat
	 *
	 * @param {Assignation[]|null} assignation Assignation to remove
	 *
	 * @throws {Error} The chat assignations array is not initialized
	 *
	 * @returns {void}
	 */
	public removeAssignation(assignation: Assignation): void {
		if (!this.assignations) {
			throw new Error(
				"Cannot remove an assignation: The chat assignations array is not initialized"
			);
		}
		const index = this.assignations.indexOf(assignation);
		if (index !== -1) {
			this.assignations.splice(index, 1);
		}
	}

	/**
	 * Clear the chat assignations
	 *
	 * @throws {Error} The chat assignations array is not initialized
	 *
	 * @returns {void}
	 */
	public clearAssignations(): void {
		if (!this.assignations) {
			throw new Error(
				"Cannot clear assignations: The chat assignations array is not initialized"
			);
		}
		this.assignations = [];
	}

	/**
	 * Set the chat assignations
	 *
	 * @param {Assignation|null} assignations New chat assignations or null to not initialize the array
	 */
	public setAssignations(assignations: Assignation[] | null): void {
		this.assignations = assignations;
	}

	/**
	 * Get the chat assignations
	 *
	 * @returns {Assignation[]|null} Chat assignations or null if the array is not initialized
	 */
	public getAssignations(): Assignation[] | null {
		return this.assignations;
	}

	/**
	 * Convert the Chat object to a string
	 *
	 * @returns {string} String representation of the Chat object
	 */
	public toString(): string {
		let string = `Chat `;
		if (this.id) {
			string += `[id=${this.getId()}]`;
		}
		if (this.name) {
			string += `[name=${this.getName()}]`;
		}
		if (this.messages && this.messages.length > 0) {
			string += `[messages=${this.messages.map((message) =>
				message.toString()
			)}]`;
		}
		if (this.assignations && this.assignations.length > 0) {
			string += `[assignations=${this.assignations.map((assignation) =>
				assignation.toString()
			)}]`;
		}
		return string;
	}

	/**
	 * @see APIObject#hydrateFromObject
	 */
	public hydrateFromObject(object: any): void{
		if(!object.id){
			throw new Error("Cannot hydrate object " + this.constructor.name +": id not defined");
		}
		
		// Convert nested objects to their respective types
		if (object.messages && object.messages.length > 0) {
			object.messages = object.messages.map((message: any) => {
				const newMsg = new Message();
				newMsg.hydrateFromObject(message);
				return newMsg;
			}
			);
		}
		if (object.assignations && object.assignations.length > 0) {
			object.assignations = object.assignations.map((assignation: any) => {
				const newAssign = new Assignation();
				newAssign.hydrateFromObject(assignation);
				return newAssign;
			}
			);
		}
	
		this.id = object.id;
		this.name = object.name ?? null;
		this.messages = object.messages ?? null;
		this.assignations = object.assignations ?? null;
	}

	/**
	 * Convert the Chat object to a JSON object
	 *
	 * @returns {any} JSON object suitable for API submission
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.name) {
			json.name = this.name;
		}
		if (this.messages && this.messages.length > 0) {
			json.messages = this.messages.map((message) => message.toAPIJson());
		}
		if (this.assignations && this.assignations.length > 0) {
			json.assignations = this.assignations.map((assignation) =>
				assignation.toAPIJson()
			);
		}
		return json;
	}
}
