import { APIObject } from "./APIObject";
export class Role extends APIObject {
	/**
	 * Possible roles for a user (see initial database data)
	 */
	public static readonly TYPE: { [key: string]: Role } = {
		ADMIN: new Role(1, "Administrator"),
		GUEST: new Role(2, "Guest"),
	};
	/**
	 * @var {string | null} name Role name
	 */
	private name: string | null;

	/**
	 * Create a Role object to manipulate
	 *
	 * @param {number | null} id Role identifier
	 * @param {string | null} name Role name
	 */
	public constructor(id: number | null = null, name: string | null = null) {
		super(id);
		this.name = name;
	}

	/**
	 * Set the role name
	 *
	 * @param {string|null} name New role name
	 *
	 * @returns {void}
	 */
	public setName(name: string | null): void {
		this.name = name;
	}

	/**
	 * Get the role name
	 *
	 * @returns {string | null} Role name
	 */
	public getName(): string | null {
		return this.name;
	}

	/**
	 * Convert the Role object to a string
	 *
	 * @returns {string} Textual representation of the Role object
	 */
	public toString(): string {
		let string = `Role `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.name) {
			string += `[name=${this.name}]`;
		}
		return string;
	}

	/**
	 * @see APIObject#hydrateFromObject
	 */
	public hydrateFromObject(object: any): void {
		if (!object.id) {
			throw new Error("Cannot hydrate object " + this.constructor.name + ": id not defined");
		}

		this.id = object.id;
		this.name = object.name ?? null;
	}

	/**
	 * Convert the Role object to a JSON object
	 *
	 * @returns {any} JSON object usable for API submission
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.name) {
			json.name = this.name;
		}
		return json;
	}
}
