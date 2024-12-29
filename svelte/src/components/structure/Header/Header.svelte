<style>
	@import "./Header.scss";
</style>

<script lang="ts">
	import { User } from "../../../common/classes/User";
	import { get } from "svelte/store";
	import { logout } from "../../../common/tools/_auth";
	import { appRoutes, goToPage } from "../../../common/tools/_routing";
	import * as store from "../../../common/tools/_store";
	import * as routing from "../../../common/tools/_routing";
	import Logo from "../../../../static/assets/img/logo.png";
	import SearchIcon from "../../elements/icons/menus/SearchIcon.svelte";
	import AccountIcon from "../../elements/icons/menus/AccountIcon.svelte";
	import ProfileCard from "../../composite/ProfileCard/ProfileCard.svelte";
	
	/**
	 * @var {string} slogan The application slogan
	 */
	export let slogan: string;
	/**
	 * @var {routing.Route|undefined} breadcrumbRoute The route corresponding to the current page
	 */
	let breadcrumbRoute : routing.Route | undefined = routing.findByPathname(window.location.pathname);
	/**
	 * @var {User|null} storedUser The logged-in user
	 */
	let storedUser: User | null = get(store.currentUser);
	/**
	 * @var {boolean} isProfileOpen Indicates if the profile is open
	 */
	let isProfileOpen = false;

	/**
	 * Open or close the profile
	 * 
	 * @param {boolean} show Show or hide the profile
	 * 
	 * @returns {void}
	 */
	function toggleProfile(show: boolean = !isProfileOpen) : void {
		// If the user is not logged in, redirect to the login page
		if(!storedUser) {
			goToPage(appRoutes.login);
			return;
		}
		
		isProfileOpen = show;
	}
</script>

<header class="header">
	<nav>
		<div class="branding">
			<a class="logo" href={routing.appRoutes.home.path}>
				<img src={Logo} alt="WiChat" />
			</a>
			<h1 class="slogan">{slogan}</h1>
		</div>
		<ul class="user-menu">
			<li>
				<a href={routing.appRoutes.search.path}>
					<SearchIcon />
				</a>
			</li>
			<li>
				<a href="#myProfile" on:click={(event) => toggleProfile()}>
					<AccountIcon />
				</a>
				<!-- If the profile is open, display the ProfileCard component -->
			</li>
			{#if isProfileOpen && storedUser !== null}
				<div class="profile-card">
					<ProfileCard
						on:clickName={storedUser.getNickname() === "Admin" ? () => goToPage(appRoutes.tests) : () => toggleProfile(false)}
						nickname={storedUser.getNickname() ?? "User"}
						on:close={() => logout()}
					/>
				</div>
			{/if}
		</ul>
	</nav>
	<div class="breadcrumbs">
		<ul>
			<li>
				<a href={routing.appRoutes.home.path}>{routing.appRoutes.home.name}</a>
			</li>
			<!-- If the current route is defined and is not the home page, display the link -->
			{#if breadcrumbRoute !== routing.appRoutes.home && breadcrumbRoute !== undefined}
				<li class="current">
					<a href={breadcrumbRoute.path ?? '#'}>{breadcrumbRoute.name ?? "Unknown page"}</a>
				</li>
			{/if}
		</ul>
	</div>
</header>
