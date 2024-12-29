import { APIObject } from "./APIObject";

export class Permission extends APIObject {
	/**
	 * Possible permissions in the Assignment of a User on a Chat (see initial database data)
	 */
	public static readonly TYPE: { [key: string]: Permission } = {
		ALLOWED: new Permission(1, "Free"),
		MUTED: new Permission(2, "Muted"),
		BANNED: new Permission(3, "Banned"),
	};

	/**
	 * @var {string | null} type Permission type
	 */
	private type: string | null;

	/**
	 * Create a Permission object to manipulate
	 *
	 * @param {number | null} id Permission identifier
	 * @param {string | null} type Permission type
	 */
	public constructor(id: number | null = null, type: string | null = null) {
		super(id);
		this.type = type;
	}

	/**
	 * Set the permission type
	 *
	 * @param {string|null} type New permission type
	 *
	 * @returns {void}
	 */
	public setType(type: string | null): void {
		this.type = type;
	}

	/**
	 * Get the permission name
	 *
	 * @returns {string | null} Permission name
	 */
	public getType(): string | null {
		return this.type;
	}

	/**
	 * Convert the Permission object to a string
	 *
	 * @returns {string} Textual representation of the Permission object
	 */
	public toString(): string {
		let string = `Permission `;
		if (this.id) {
			string += `[id=${this.id}]`;
		}
		if (this.type) {
			string += `[type=${this.type}]`;
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
		this.type = object.type ?? null;
	}

	/**
	 * Convert the Assignment object to a JSON object
	 *
	 * @returns {any} JSON object usable for sending via the API
	 */
	public toAPIJson(): any {
		let json: any = {};
		if (this.id) {
			json.id = this.id;
		}
		if (this.type) {
			json.type = this.type;
		}
		return json;
	}
}
