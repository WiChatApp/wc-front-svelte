<script lang="ts">
	import { onMount } from "svelte";
	import { Router, Route } from "svelte-routing";
	import * as routing from "./common/tools/_routing";
	import * as authenticator from "./common/tools/_auth";
	import AuthPage from "./pages/AuthPage/AuthPage.svelte";
	import HomePage from "./pages/HomePage/HomePage.svelte";
	import SearchPage from "./pages/SearchPage/SearchPage.svelte";
	import ChatPage from "./pages/ChatPage/ChatPage.svelte";
	import ErrorPage from "./pages/ErrorPage/ErrorPage.svelte";
	import Header from "./components/structure/Header/Header.svelte";
	import Footer from "./components/structure/Footer/Footer.svelte";
	import PageTitle from "./components/structure/PageTitle/PageTitle.svelte";
	import TestPage from "./pages/TestPage/TestPage.svelte";
	import ApiTestPage from "./pages/APITestPage/APITestPage.svelte";
	import JoinPage from "./pages/JoinPage/JoinPage.svelte";
	import type { User } from "./common/classes/User";

	// Internal component working variables & functions
	let currentRoute: routing.Route | undefined = routing.findByPathname(
		window.location.pathname
	);
	let pageTitle: string;
	let storedUser: User | null = authenticator.getStoredUser();

	onMount(() => {
		// Ensure the main content takes up all available height
		// (to keep the footer at the bottom of the page even if the content is short)
		const header = document.querySelector("header");
		const footer = document.querySelector("footer");
		const main = document.querySelector("main");
		const headerSize = header ? header.getBoundingClientRect().height : 0;
		const footerSize = footer ? footer.getBoundingClientRect().height : 0;
		if (main) {
			main.style.minHeight = `calc(100vh - ${headerSize}px - ${footerSize}px)`;
		}
	});

	$: {
		// Redirect to the login page if the user is not logged in
		if (storedUser === null) {
			// If the user is not already on the login page, redirect them there
			if (currentRoute?.path !== routing.appRoutes.login.path) {
				routing.goToPage(routing.appRoutes.login);
			}
		} else {
			async function checkUser() {
				// If the logged-in user can be authenticated, log them in
				// Otherwise, log them out
				const username = storedUser?.getNickname();
				const password = storedUser?.getPassword();
				if (!username || !password) {
					authenticator.logout();
				} else {
					if (!(await authenticator.login(username, password))) {
						authenticator.logout();
					}
				}
			}
			checkUser();
		}

		// Update the page title on each route change
		pageTitle = currentRoute?.name ?? "Unknown Page";
	}
</script>

<Header slogan="Wireless Chat" />
<main>
	<PageTitle title={pageTitle} />
	<Router>
		{#if storedUser === null}
			<Route path={routing.appRoutes.login.path} component={AuthPage} />
		{:else}
			<Route path={routing.appRoutes.login.path} component={AuthPage} />
			<Route path={routing.appRoutes.home.path} component={HomePage} />
			<Route
				path={routing.appRoutes.search.path}
				component={SearchPage}
			/>
			<Route path={routing.appRoutes.chat.path} component={ChatPage} />
			<Route path={routing.appRoutes.join.path} component={JoinPage} />
			{#if storedUser.getNickname() === "Admin"}
				<Route
					path={routing.appRoutes.tests.path}
					component={TestPage}
				/>
				<Route
					path={routing.appRoutes.apiTest.path}
					component={ApiTestPage}
				/>
			{/if}
		{/if}
		<Route path="*">
			<ErrorPage code={404} />
		</Route>
	</Router>
</main>
<Footer />
