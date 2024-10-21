<script lang="ts">
	import { onMount } from "svelte";
	import * as authentifier from "../../common/tools/_auth";
	import { appRoutes, goToPage } from "../../common/tools/_routing";
	import Notification from "../../components/structure/Notification/Notification.svelte";
	import Input from "../../components/elements/Input/Input.svelte";
	import Button from "../../components/elements/Button/Button.svelte";
	import * as dataLogic from "./dataLogic";
	import * as debug from "../../common/tools/_debug";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";
	import type { NotificationProps } from "../../components/structure/Notification/NotificationInterface";

	/**
	 * @var {string} inputUsername Entered username
	 */
	let inputUsername: string = "";
	/**
	 * @var {string} inputPassword Entered password
	 */
	let inputPassword: string = "";
	/**
	 * @var {string} inputConfirmPassword Confirmed entered password
	 */
	let inputConfirmPassword: string = "";
	/**
	 * @var {NotificationProps} notification Notification properties to display
	 */
	let notification : NotificationProps = {
		message: "",
		type: "info",
	};
	/**
	 * @var {boolean} isLoading Indicates if a loading is in progress
	 */
	let isLoading: boolean = false;
	/**
	 * @var {URLSearchParams} urlParams URL parameters
	 */
	const urlParams: URLSearchParams = new URLSearchParams(
		window.location.search
	);
	/**
	 * @var {boolean} showRegister Indicates if the registration form should be displayed
	 */
	const showRegister : boolean = urlParams.get("register") == "true" ? true: false;

	/**
	 * Authenticate the user
	 * 
	 * @param {string} username Username
	 * @param {string} password Password
	 * 
	 * @return {Promise<void>}
	 */
	async function login(username : string, password : string) : Promise<void> {
		// If fields are empty, display a notification
		if (username === "" || password === "") {
			notification = {
				message: "Please fill in all fields",
				type: "error",
			};
			return;
		}
		try{
			isLoading = true;
			const authSuccess : boolean = await authentifier.login(username,password);
			if(authSuccess){
				// Redirect to the home page
				goToPage(appRoutes.home);
			}
			else{
				notification = {
					message: "Incorrect username or password",
					type: "error",
				}
			}
			return;
		}
		catch(error : any){
			debug.consoleLog("Error during authentication: " + error, debug.Level.ERROR)
			notification = {
				type: "error",
				message: "We are experiencing technical difficulties, please try again later.",
			}
			return;
		} finally {
			isLoading = false;
		}
	};

	/**
	 * Register the user
	 * 
	 * @param {string} username Username
	 * @param {string} password Password
	 * @param {string} confirmPassword Confirmed password
	 * 
	 * @return {Promise<void>}
	 */
	async function register(username : string, password : string, confirmPassword : string) : Promise<void> {
		// If fields are empty, display a notification
		if (username === "" || password === "" || confirmPassword === "") {
			notification = {
				message: "Please fill in all fields",
				type: "error",
			};
			return;
		}
		if(inputPassword !== inputConfirmPassword){
			notification = {
				message: "Passwords do not match",
				type: "error",
			};
			return;
		}
		try{
			const registerSuccess : boolean = await dataLogic.register(inputUsername, inputPassword);
			if(registerSuccess){
				// Redirect to the home page
				login(username, password);
			}
			else{
				notification = {
					message: "Username already taken",
					type: "info",
				}
			}
			return;
		}
		catch(error : any){
			debug.consoleLog("Error during registration: " + error.message, debug.Level.ERROR)
			notification = {
				type: "error",
				message: "We are experiencing technical difficulties, please try again later.",
			}
			return;
		}
	};

	onMount(() => {
		// If the user is already logged in, redirect to the home page
		if (authentifier.getStoredUser()) {
			goToPage(appRoutes.home);
		}
	});
</script>

{#if showRegister}
	<div class="form">
		<h2>Sign Up</h2>
		{#if notification.message !== ""}
			<Notification type={notification.type}
				>{notification.message}</Notification
			>
		{/if}
		<div class="field">
			<label for="username">Username</label>
			<Input
				type="text"
				placeholder="Username"
				bind:value={inputUsername}
				on:submit={() => {register(inputUsername, inputPassword, inputConfirmPassword)}}
				id="username"
			/>
		</div>
		<div class="field">
			<label for="password">Password</label>
			<Input
				type="password"
				placeholder="Password"
				bind:value={inputPassword}
				on:submit={() => {register(inputUsername, inputPassword, inputConfirmPassword)}}
				id="confirmPassword"
			/>
		</div>
		<div class="field">
			<label for="password">Confirm Password</label>
			<Input
				type="password"
				placeholder="Confirm Password"
				bind:value={inputConfirmPassword}
				on:submit={() => {register(inputUsername, inputPassword, inputConfirmPassword)}}
				id="password"
			/>
		</div>
		<div class="field">
			<Button on:click={() => { register(inputUsername, inputPassword, inputConfirmPassword) }}>Sign Up</Button>
		</div>
		<p>Already registered?  <a href="?register=false">Log in</a>!</p>
	</div>
{:else}
	<div class="form">
		<h2>Log In</h2>
		{#if isLoading}
			<Notification type="info">Logging in...<Spinner/></Notification>
		{:else}
			{#if notification.message !== ""}
				<Notification type={notification.type}
					>{notification.message}</Notification
				>
			{/if}
		{/if}
		<div class="field">
			<label for="username">Username</label>
			<Input
				type="text"
				placeholder="Username"
				bind:value={inputUsername}
				on:submit={() => {login(inputUsername, inputPassword)}}
				id="username"
			/>
		</div>
		<div class="field">
			<label for="password">Password</label>
			<Input
				type="password"
				placeholder="Password"
				bind:value={inputPassword}
				on:submit={() => {login(inputUsername, inputPassword)}}
				id="password"
			/>
		</div>
		<div class="field">
			<Button on:click={() => {login(inputUsername, inputPassword)}}>Log In</Button>
		</div>
		<p>No account yet? <a href="?register=true">Sign Up</a></p>
	</div>
{/if}
<style>
	@import "./AuthPage.scss";
</style>