import { Status } from "./Status";
import { Assignment } from "./Assignment";
import { APIObject } from "./APIObject";

export class User extends APIObject {
	/**
	 * @var {string | null} nickname User's nickname
	 */
	private nickname: string | null;
	/**
	 * @var {string | null} password User's password
	 */
	private password: string | null;
	/**
	 * @var {Date | null} creationDate User's creation date
	 */
	private creationDate: Date | null;
	/**
	 * @var {Status | null} status User's status
	 * @see {@link User.STATUS}
	 */
	private status: Status | null;
	/**
	 * @var {Assignment[] | null} assignments User's assignments
	 * @see {@link Assignment}
	 */
	private assignments: Assignment[] | null;

	/**
	 * Create a user object to manipulate
	 *
	 * @param {number | null} id User's ID
	 * @param {string | null} nickname User's nickname
	 * @param {string | null} password User's password
	 * @param {Date | null} creationDate User's creation date
	 * @param {Status | null} status User's status
	 * @param {Assignment[] | null} assignments User's assignments
	 */
	public constructor(
		id: number | null = null,
		nickname: string | null = null,
		password: string | null = null,
		creationDate: Date | null = null,
		status: Status | null = null,
		assignments: Assignment[] | null = null
	) {
		super(id);
		this.nickname = nickname;
		this.password = password;
		this.creationDate = creationDate;
		this.status = status;
		this.assignments = assignments;
	}

	/**
	 * Set the user's nickname
	 *
	 * @param {string | null} nickname New user's nickname
	 *
	 * @returns {void}
	 */
	public setNickname(nickname: string | null): void {
		this.nickname = nickname;
	}

	/**
	 * Get the user's nickname
	 *
	 * @returns {string | null} User's nickname
	 */
	public getNickname(): string | null {
		return this.nickname;
	}

	/**
	 * Set the user's password
	 *
	 * @param {string | null} password New user's password
	 *
	 * @returns {void}
	 */
	public setPassword(password: string | null): void {
		this.password = password;
	}

	/**
	 * Get the user's password
	 *
	 * @returns {string | null} User's password
	 */
	public getPassword(): string | null {
		return this.password;
	}

	/**
	 * Set the user's creation date
	 *
	 * @param {Date | null} creationDate New user's creation date
	 */
	public setCreationDate(creationDate: Date | null): void {
		this.creationDate = creationDate;
	}

	/**
	 * Get the user's creation date
	 *
	 * @returns {Date | null} User's creation date
	 */
	public getCreationDate(): Date | null {
		return this.creationDate;
	}

	/**
	 * Set the user's status
	 *
	 * @param {Status | null} status New user's status
	 *
	 * @returns {void}
	 */
	public setStatus(status: Status | null): void {
		this.status = status;
	}

	/**
	 * Get the user's status
	 *
	 * @returns {Status | null} User's status
	 */
	public getStatus(): Status | null {
		return this.status;
	}

	/**
	 * Set the user's assignments
	 *
	 * @param {Assignment[]} assignments New user's assignments
	 *
	 * @returns {void}
	 */
	public setAssignments(assignments: Assignment[] | null): void {
		this.assignments = assignments;
	}

	/**
	 * Get the user's assignments
	 *
	 * @returns {Assignment[] | null} User's assignments
	 */
	public getAssignments(): Assignment[] | null {
		return this.assignments;
	}

	/**
	 * Convert the User object to a string
	 *
	 * @returns {string} Textual representation of the User object
	 */
	public toString(): string {
		let string = `User `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.nickname) {
			string += `[nickname=${this.nickname}]`;
		}
		if (this.password) {
			string += `[password=${this.password}]`;
		}
		if (this.creationDate) {
			string += `[creationDate=${this.creationDate.toString()}]`;
		}
		if (this.status) {
			string += `[status=${this.status.toString()}]`;
		}
		if (this.assignments) {
			string += `[assignments=[${this.assignments
				.map((assignment) => assignment.toString())
				.join(", ")}]]`;
		}
		return string;
	}

	/**
	 * @see APIObject#hydrateFromObject
	 */
	public hydrateFromObject(object: any): void{
		if(!object.id){
			throw new Error("Unable to hydrate the object " + this.constructor.name +": id not defined");
		}		
		// Convert nested objects to their respective types
		if(object.creationDate){
			object.creationDate = new Date(object.creationDate);
		}
		if (object.status) {
			const newStatus = new Status();
			newStatus.hydrateFromObject(object.status);
			object.status = newStatus;
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
		this.nickname = object.nickname ?? null;
		this.password = object.password ?? null;
		this.creationDate = object.creationDate ?? null;
		this.status = object.status ?? null;
		this.assignments = object.assignments ?? null;
	}

	/**
	 * Convert the Assignment object to a JSON object
	 *
	 * @returns {any} JSON object usable for API sending
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.nickname) {
			json.nickname = this.nickname;
		}
		if (this.password) {
			json.password = this.password;
		}
		if (this.creationDate) {
			json.creationDate = this.creationDate;
		}
		if (this.status) {
			json.status = this.status.getIRI();
		}
		if (this.assignments && this.assignments.length > 0) {
			json.assignments = this.assignments.map((assignment) =>
				assignment.getIRI()
			);
		}
		return json;
	}
}
