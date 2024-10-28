import * as api from "../tools/_api";

export abstract class APIObject {
	/**
	 * @var {number | null} id Object identifier (accessible by child classes)
	 */
	protected id: number | null;

	/**
	 * Create an object linked to the API
	 * 
	 * @param {number | null} id Object identifier
	 */
	protected constructor(id: number | null) {
		this.id = id;
	}

	/**
	 * Set the object identifier
	 * 
	 * @param {number | null} id Object identifier
	 * 
	 * @return {void}
	 */
	protected setId(id: number | null): void {
		this.id = id;
	}

	/**
	 * Get the object identifier
	 * 
	 * @return {number | null} Object identifier
	 */
	public getId(): number | null {
		return this.id;
	}

	/**
	 * Get the object as a string
	 * 
	 * @return {string} String representation of the object
	 */
	public abstract toString(): string;

	/**
	 * Get the object as JSON usable by the API
	 * 
	 * @return {any} JSON representation of the object usable by the API
	 */
	public abstract toAPIJson(): any;

	/**
	 * Get the Internal Resource Identifier of the object as a string
	 *
	 * @returns {string} Object IRI
	 */
	public getIRI(): string {
		if (!this.id) {
			throw new Error(
				"Unable to retrieve the object's IRI: This object has no defined ID"
			);
		}
		return api.URL.path + "/" + this.getEndpoint() + "/" + this.id;
	}

	/**
	 * Get the class endpoint
	 * 
	 * @return {string} Class endpoint
	 * 
	 * @throws {Error} Error if the class has no endpoint
	 */
	public getEndpoint(): string {
		const className = this.constructor.name.toLowerCase();
		// If the class name ends with s
		if (className.endsWith("s")) return className + "es";
		return className + "s";
	}

	/**
	 * Get the class endpoint (as a static constant)
	 * 
	 * @return {string} Class endpoint
	 */
	public static get ENDPOINT(): string {
		const className = this.name.toLowerCase();
		// If the class name ends with s
		if (className.endsWith("s")) return className + "es";
		return className + "s";
	}

	/**
	 * Hydrate the object from a data object
	 * 
	 * @param {any} object Data object
	 * 
	 * @throws {Error} Error if the object does not contain the necessary information
	 */
	public abstract hydrateFromObject(object: any): void;

	/**
	 * Populate the object from the API
	 * 
	 * @return {Promise<void>} Once the data is retrieved, the promise data is used to hydrate the object
	 * 
	 * @throws {Error} Error when retrieving the object from the API
	 */
	public hydrateFromAPI = async (): Promise<void> => {
		const id = this.getId();
		if (id === null) throw new Error("Unable to retrieve the object from the API without an identifier!");
		const json = await api.getDataById(this.getEndpoint(), id);
		this.hydrateFromObject(json);
	}

	/**
	 * Send the object to the API
	 * 
	 * @return {Promise<any>} Object sent to the API
	 * 
	 * @throws {Error} Error when sending the object to the API
	 */
	public sendToAPI = async (): Promise<any> => {
		return await api.postData(this.getEndpoint(), this.toAPIJson());
	}
}
