/**
 * The Route interface defines the properties of a Route object.
 * This type of object is a dictionary that contains a path and a name for each route.
 */
export interface Route {
	path: string;
	name: string;
}

/**
 * @var {Object} appRoutes Dictionary containing the application's routes
 * 
 * @see Route
 */
export const appRoutes: { [key: string]: Route } = {
	login: { path: "/login", name: "Login" },
	home: { path: "/", name: "Home" },
	search: { path: "/search", name: "Search" },
	chat: { path: "/chat", name: "Chat" },
	join: { path: "/join", name: "Join a chat" },
	tests: { path: "/tests", name: "Tests" },
	apiTest: { path: "/tests/api", name: "API Tests" },
};

/**
 * This function finds a Route object from a path
 *
 * @param {string} path Path of the route to find
 * 
 * @returns {Route | undefined} The corresponding route or undefined if no route matches
 *
 * @example
 * ```ts
 * // Returns { path: '/login', name: 'Login' }
 *  findByPathname('/login')
 * ```
 *
 * @see appRoutes
 */
export function findByPathname(path: string): Route | undefined {
	// Remove the trailing slash (except for root) and URL parameters
	let paramLessPath = path.replace(/\/*$/, "");
	if (paramLessPath === "") {
		paramLessPath = "/";
	}
	return Object.values(appRoutes).find(
		(route) => route.path === paramLessPath
	);
}

/**
 * This function redirects the user to another page
 *
 * @param {string} route Route to redirect to (see {@link appRoutes})
 * @param {any} params Parameters to pass to the page (as an object)
 * 
 * @example
 * ```ts
 * // Redirects the user to the chat page with the chat ID as a parameter
 * goToPage(appRoutes.chat, { id: 5 });
 * ```
 */
export function goToPage(route: Route, params?: any) {
	// Navigate does not reload the page, which can cause
	// issues with refreshing the application's state
	// Until a solution is found, we use window.location.href

	let url: string = route.path;
	// Add parameters to the URL as a query string
	if (params) {
		url += "?";
		for (const key in params) {
			url += `${key}=${params[key]}&`;
		}
		url = url.slice(0, -1);
	}

	window.location.href = url; 
}
