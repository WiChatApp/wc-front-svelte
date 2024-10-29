import { Message } from "./Message";
import { APIObject } from "./APIObject";
import { Assignment } from "./Assignment";

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
	 * @var {Assignment[]|null} assignments Chat assignments
	 * @see {@link Assignment}
	 */
	private assignments: Assignment[] | null;

	/**
	 * Create a Chat object to manipulate
	 *
	 * @param {number | null} id Chat identifier
	 * @param {string|null} name Chat name
	 * @param {Message[]|null} messages Chat messages
	 * @param {Assignment[]|null} assignments Chat assignments
	 */
	public constructor(
		id: number | null = null,
		name: string | null = null,
		messages: Message[] | null = null,
		assignments: Assignment[] | null = null
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
		this.assignments = assignments;
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
	 * Add an assignment to the chat
	 *
	 * @param {Assignment} assignment Assignment to add
	 *
	 * @throws {Error} The chat assignments array is not initialized
	 */
	public addAssignment(assignment: Assignment): void {
		if (!this.assignments) {
			throw new Error(
				"Cannot add an assignment: The chat assignments array is not initialized"
			);
		}
		this.assignments.push(assignment);
	}

	/**
	 * Remove an assignment from the chat
	 *
	 * @param {Assignment[]|null} assignment Assignment to remove
	 *
	 * @throws {Error} The chat assignments array is not initialized
	 *
	 * @returns {void}
	 */
	public removeAssignment(assignment: Assignment): void {
		if (!this.assignments) {
			throw new Error(
				"Cannot remove an assignment: The chat assignments array is not initialized"
			);
		}
		const index = this.assignments.indexOf(assignment);
		if (index !== -1) {
			this.assignments.splice(index, 1);
		}
	}

	/**
	 * Clear the chat assignments
	 *
	 * @throws {Error} The chat assignments array is not initialized
	 *
	 * @returns {void}
	 */
	public clearAssignments(): void {
		if (!this.assignments) {
			throw new Error(
				"Cannot clear assignments: The chat assignments array is not initialized"
			);
		}
		this.assignments = [];
	}

	/**
	 * Set the chat assignments
	 *
	 * @param {Assignment|null} assignments New chat assignments or null to not initialize the array
	 */
	public setAssignments(assignments: Assignment[] | null): void {
		this.assignments = assignments;
	}

	/**
	 * Get the chat assignments
	 *
	 * @returns {Assignment[]|null} Chat assignments or null if the array is not initialized
	 */
	public getAssignments(): Assignment[] | null {
		return this.assignments;
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
		if (this.assignments && this.assignments.length > 0) {
			string += `[assignments=${this.assignments.map((assignment) =>
				assignment.toString()
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
		if (object.assignments && object.assignments.length > 0) {
			object.assignments = object.assignments.map((assignment: any) => {
				const newAssign = new Assignment();
				newAssign.hydrateFromObject(assignment);
				return newAssign;
			}
			);
		}
	
		this.id = object.id;
		this.name = object.name ?? null;
		this.messages = object.messages ?? null;
		this.assignments = object.assignments ?? null;
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
		if (this.assignments && this.assignments.length > 0) {
			json.assignments = this.assignments.map((assignment) =>
				assignment.toAPIJson()
			);
		}
		return json;
	}
}
