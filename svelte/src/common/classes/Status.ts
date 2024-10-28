import { APIObject } from "./APIObject";

export class Status extends APIObject {
	/**
	 * Possible statuses for a user (see initial data in the database)
	 */
	public static readonly TYPE: { [key: string]: Status } = {
		OFFLINE: new Status(1, "Offline"),
		ONLINE: new Status(2, "Online"),
	};

	/**
	 * @var {string | null} status description
	 */
	private description: string | null;

	/**
	 * Create a user object to manipulate
	 *
	 * @param {number | null} id Status type identifier
	 * @param {string | null} description Status description
	 */
	constructor(id: number | null = null, description: string | null = null) {
		super(id);
		this.description = description;
	}
	
	/**
	 * Set the status description
	 *
	 * @param {string | null} description The status description
	 */
	public setDescription(description: string | null) {
		this.description = description;
	}

	/**
	 * Get the status description
	 *
	 * @returns {string | null} The status description
	 */
	public getDescription(): string | null {
		return this.description;
	}

	/**
	 * Convert the Status object to a string
	 *
	 * @returns {string} Textual representation of the Status object
	 */
	public toString(): string {
		let string = `Status `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.description) {
			string += `[description=${this.description}]`;
		}
		return string;
	}

	/**
	 * @see APIObject#hydrateFromObject
	 */
	public hydrateFromObject(object: any): void {
		if (!object.id) {
			throw new Error("Unable to hydrate the object " + this.constructor.name + ": id not defined");
		}

		this.id = object.id;
		this.description = object.description ?? null;
	}

	/**
	 * Convert the Status object to a JSON object
	 *
	 * @returns {any} JSON object suitable for API submission
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.description) {
			json.description = this.description;
		}
		return json;
	}
}
