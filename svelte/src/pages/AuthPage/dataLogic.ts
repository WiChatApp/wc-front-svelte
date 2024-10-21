import * as authentifier from "../../common/tools/_auth";

/**
 * Attempt to register the user
 * 
 * @param username Username
 * @param password Password
 * 
 * @returns {Promise<boolean>} Returns true if registration succeeded, false if the username is already taken
 */
export async function register(username: string, password: string): Promise<boolean> {
	try {
		const registerSuccess: boolean = await authentifier.register(
			username,
			password
		);
		return registerSuccess;
	} catch (err: unknown) {
		throw err;
	}
}
