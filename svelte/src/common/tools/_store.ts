import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { User } from "../classes/User";
import * as debug from "./_debug";

// This store allows storing information between all components of the application
// until the page is reloaded

/**
 * @var {any} localStoredUser Default value for the user store
 */
const localStoredUser: any = JSON.parse(localStorage.getItem("user") ?? "null");
/**
 * @var {User} userObject User object
 */
const userObject: User = new User();
if(localStoredUser !== null) {
	userObject.hydrateFromObject(localStoredUser);
}
/**
 * @var {Writable<User | null>} currentUser Currently logged-in user
 */
export let currentUser: Writable<User | null> = writable(localStoredUser ? userObject : null);

// Each time the user is updated, store it in localStorage
currentUser.subscribe((newValue) => {
	if (newValue === null) {
		localStorage.removeItem("user");
		debug.consoleLog("User removed from store", debug.Level.INFO);
	} else {
		localStorage.setItem("user", JSON.stringify(newValue));
		debug.consoleLog(
			`User saved in store: ${newValue}`,
			debug.Level.INFO
		);
	}
});
