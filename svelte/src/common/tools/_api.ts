import * as debug from "./_debug";

/**
 * Available environments for the application
 */
enum ENVIRONMENTS {
	LOCAL = "local",
	DISTANT = "distant",
}
/**
 * @var {string} ENV Current environment (see {@link ENVIRONMENTS})
 */
const ENV = ENVIRONMENTS.LOCAL;

/**
 * @var {Record<ENVIRONMENTS, Record<string, string>>} ENV_URLS API URLs for each environment (see {@link ENVIRONMENTS})
 */
const ENV_URLS: Record<ENVIRONMENTS, Record<string, string>> = {
	local: {
		protocol: "http",
		host: "localhost",
		port: "80",
		path: "/api",
	},
	distant: {
		protocol: "http",
		host: "www.wichat.com",
		port: "80",
		path: "/wc/",
	},
};

/**
 * @var {Record<ENVIRONMENTS, string>} selectedURL API URL for the selected environment (see {@link ENVIRONMENTS})
 */
const selectedURL = ENV_URLS[ENV];

/**
 * @var {Record<string, string>} URL Composition of the API URL
 */
export const URL: Record<string, string> = {
	protocol: selectedURL.protocol,
	host: selectedURL.host,
	port: selectedURL.port,
	path: selectedURL.path,
};

/**
 * @var {Record<string, string>} METHODS HTTP methods supported by the application
 */
export const METHODS: Record<string, string> = {
	CREATE: "POST",
	GET: "GET",
	DELETE: "DELETE",
	REPLACE: "PUT",
	UPDATE: "PATCH",
};

/**
 * Fetch data from a URL
 *
 * @param {string} endpoint Endpoint to perform operations on
 * @param {string} method HTTP method to use (see {@link METHODS})
 * @param {object} data Data to send (optional)
 * @param {number | null} id Entity ID starting from 1 (optional)
 *
 * @returns {Promise<any>} Promise containing the fetched data
 *
 * @throws {Error} If the entity or method does not exist,
 * if the id is missing for a method that requires it,
 * if data is missing for a method that requires it,
 * if data is specified for a method that does not support it,
 * if an error occurs while fetching the data
 */
export const fetchData = async (
	endpoint: string,
	method: string,
	data: object | null = null,
	id: number = 0
): Promise<any> => {
	// ========== INPUT PARAMETER VALIDATION ==========
	// If the method does not exist
	if (!Object.values(METHODS).includes(method)) {
		const errorMsg: string = `The method ${method} is not supported by this application!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}
	// If the user did not specify an id for a method that requires it
	if (
		(method === METHODS.REPLACE ||
			method === METHODS.UPDATE ||
			method === METHODS.DELETE) &&
		!id
	) {
		let errorMsg: string = `The method ${method} requires an id!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}
	// If the user specified an id for a method that does not support it
	if (method === METHODS.CREATE && id) {
		const errorMsg: string = `The method ${method} does not support the use of an id!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}
	// If the user did not specify data for a method that requires it
	if (
		(method === METHODS.CREATE ||
			method === METHODS.REPLACE ||
			method === METHODS.UPDATE) &&
		!data
	) {
		const errorMsg: string = `The method ${method} requires data to be sent!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}
	// If the user specified data for a method that does not support it
	if (method === METHODS.DELETE && data) {
		const errorMsg: string = `The method ${method} does not support sending data!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}
	// If the user specified filter data while also specifying an id
	if (id && data) {
		const errorMsg: string = `Cannot specify both filter data and an id at the same time!`;
		debug.consoleLog(errorMsg, debug.Level.ERROR);
		throw new Error(errorMsg);
	}

	// ========== REQUEST CONSTRUCTION ==========
	// Construct the URL (depending on the presence of an id)
	let url: string = `${URL.protocol}://${URL.host}:${URL.port}${
		URL.path
	}/${endpoint}${id ? `/${id}` : ""}`;
	// If the user specified filter data
	if (method === METHODS.GET && data) {
		// Construct the request parameters
		const searchParams = new URLSearchParams(
			data as Record<string, string>
		);
		url += `?${searchParams.toString()}`;
	}

	// Construct the request parameters
	const fetchParams: Record<string, string | object> = {
		method: method,
	};
	fetchParams.headers = {
		Accept: "application/json",
	};
	// If the user specified data to send
	if (method !== METHODS.GET) {
		fetchParams.headers = {
			...fetchParams.headers,
			"Content-Type": "application/json",
		};
		if (data) {
			fetchParams.body = JSON.stringify(data);
		}
	}

	// ========== FETCHING DATA ==========
	debug.consoleLog(
		`Fetching data from ${url}`,
		debug.Level.DEBUG
	);

	let apiResponse: Response;
	let dataPromise: Promise<any> | null = null;

	debug.consoleLog(
		"fetch(" + url + ", " + JSON.stringify(fetchParams) + ")",
		debug.Level.DEBUG
	);

	apiResponse = await fetch(url, fetchParams);

	debug.consoleLog(
		`HTTP response received from ${url}: ${apiResponse.status} ${apiResponse.statusText}`,
		debug.Level.DEBUG
	);
	debug.consoleLog(apiResponse, debug.Level.DEBUG);

	if (!apiResponse.ok) {
		debug.consoleLog(
			`Error during the request to ${url}`,
			debug.Level.ERROR
		);
		debug.consoleLog(apiResponse, debug.Level.DEBUG);
		throw new Error("Error during the request");
	} else {
		// In case of deletion (201), no data to retrieve
		if (apiResponse.status !== 204) dataPromise = await apiResponse.json();
	}
	return dataPromise;
};

/**
 * Fetch data from the API by ID
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {number} id Entity ID (0 = all entities)
 *
 * @returns {Promise<any>} Promise containing the fetched data
 */
export async function getDataById(
	endpoint: string,
	id: number = 0
): Promise<any> {
	return await fetchData(endpoint, METHODS.GET, null, id);
}

/**
 * Fetch data from the API by filters
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {object} filters Filters to apply
 *
 * @returns {Promise<any>} Promise containing the fetched data
 */
export async function getDataByFilter(
	endpoint: string,
	filters: object | null = null
): Promise<any> {
	return await fetchData(endpoint, METHODS.GET, filters);
}

/**
 * Create an entity
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {object} object Data to send
 *
 * @returns {Promise<any>} Promise containing the fetched data
 *
 * @throws {Error} If the request is invalid or if an error occurs while fetching the data
 */
export async function postData(endpoint: string, object: any): Promise<any> {
	return await fetchData(endpoint, METHODS.CREATE, object);
}

/**
 * Replace an entity
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {any} object Data to replace
 * @param {number} id Entity ID to replace
 *
 * @returns {Promise<any>} Promise containing the fetched data
 *
 * @throws {Error} If the request is invalid or if an error occurs while fetching the data
 */
export async function putData(
	endpoint: string,
	object: any,
	id: number
): Promise<any> {
	return await fetchData(endpoint, METHODS.REPLACE, object, id);
}

/**
 * Update an entity
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {any} object Data to send
 *
 * @returns {Promise<any>} Promise containing the fetched data
 *
 * @throws {Error} If the request is invalid or if an error occurs while fetching the data
 */
export async function patchData(endpoint: string, object: any): Promise<any> {
	return await fetchData(endpoint, METHODS.UPDATE, object, object.id);
}

/**
 * Delete an entity
 *
 * @param {string} endpoint The endpoint to perform operations on
 * @param {number} id Entity ID
 *
 * @returns {Promise<any>} Promise containing the fetched data
 *
 * @throws {Error} If the request is invalid or if an error occurs while fetching the data *
 */
export async function deleteData(endpoint: string, id: number): Promise<any> {
	return await fetchData(endpoint, METHODS.DELETE, null, id);
}
