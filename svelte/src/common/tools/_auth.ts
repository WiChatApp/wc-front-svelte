import { User } from "../classes/User";
import * as store from "./_store";
import * as debug from "./_debug";
import * as utils from "./_utils";
import { get } from "svelte/store";
import { appRoutes, goToPage } from "./_routing";
import * as api from "./_api";
import { Status } from "../classes/Status";

/**
 * Attempt to register a new user
 *
 * @param {string} username The username
 * @param {string} password The password
 *
 * @returns {Promise<boolean>} True if the user was successfully registered, false if the user already exists
 *
 * @throws {Error} If an error occurs during user registration
 */
export async function register(
	username: string,
	password: string
): Promise<boolean> {
	try {
		// Retrieve the list of users containing the username
		const usersArray = await api.getDataByFilter(User.ENDPOINT, {
			nickname: username,
		});

		// If the user does not already exist, register them
		if (
			usersArray.find((user: any) => user.nickname === username) ===
			undefined
		) {
			const userToCreate = new User(
				0,
				username,
				password,
				new Date(),
				Status.TYPE.ONLINE,
				[]
			);
			const userCreated = await userToCreate.sendToAPI();

			if (userCreated) {
				debug.consoleLog(
					`User ${username} successfully registered`,
					debug.Level.INFO
				);
				return true;
			} else {
				// If the user could not be registered, throw an error
				// which will be caught by the catch block
				throw new Error(
					"Unable to send data to the API to register the user"
				);
			}
		} else {
			// If the user already exists, return false
			return false;
		}
	} catch (error: any) {
		debug.consoleLog(
			`Error registering user with credentials ${username}:${password} \n ${error}`,
			debug.Level.ERROR
		);
		throw error;
	}
}

/**
 * Attempt to log in the user with a username and password
 *
 * @param {string} username The username
 * @param {string} password The password
 *
 * @returns {Promise<boolean>} True if the user was successfully logged in, false otherwise
 *
 * @throws {Error} If an error occurs during user login
 */
export async function login(
	username: string,
	password: string
): Promise<boolean> {
	try {
		const usersArray = await api.getDataByFilter(User.ENDPOINT, {
			nickname: username,
			password: password,
		});
		// If one of the users matches the provided credentials, log them in
		const userToLogin = usersArray.find(
			(user: any) =>
				user.nickname === username && user.password === password
		);
		if (userToLogin === undefined) {
			return false;
		} else {
			const userToStore = new User();
			userToStore.hydrateFromObject(userToLogin);
			store.currentUser.set(userToStore);
			return true;
		}
	} catch (error: any) {
		debug.consoleLog(
			`Error logging in user with credentials ${username}:${password} \n ${error}`,
			debug.Level.ERROR
		);
		throw error;
	}
}

/**
 * Log out the user
 */
export function logout() {
	store.currentUser.set(null);
	goToPage(appRoutes.login);
}

/**
 * Retrieve the user stored in localStorage
 *
 * @returns {User | null} User stored in localStorage
 */
export function getStoredUser(): User | null {
	let userToReturn: User | null = null;

	// If the user is not already available in the store, retrieve them from localStorage
	const storeUser = get(store.currentUser);
	if (storeUser === null) {
		const localUser = JSON.parse(localStorage.getItem("user") ?? "null");
		if (localUser) {
			const userToHydrate = new User();
			userToHydrate.hydrateFromObject(localUser);
			userToReturn = userToHydrate;
		}
		debug.consoleLog(
			"User retrieved from localStorage",
			debug.Level.DEBUG
		);
	} else {
		const userToHydrate = new User();
		userToHydrate.hydrateFromObject(storeUser);
		userToReturn = userToHydrate;

		debug.consoleLog(
			"User retrieved from store",
			debug.Level.DEBUG
		);
	}

	debug.consoleLog(userToReturn, debug.Level.DEBUG);

	// If the retrieved user is not already in the store, add them
	if (!utils.isEqual(userToReturn, storeUser)) {
		store.currentUser.set(userToReturn);
	}

	return userToReturn;
}
