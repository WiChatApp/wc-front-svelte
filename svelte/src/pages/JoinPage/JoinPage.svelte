<script lang="ts">
	import { onMount } from "svelte";
	import * as dataLogic from "./dataLogic";
	import * as debug from "../../common/tools/_debug";
	import * as routing from "../../common/tools/_routing";
	import * as authentifier from "../../common/tools/_auth";
	import type { Chat } from "../../common/classes/Chat";
	import type { User } from "../../common/classes/User";
	import Notification from "../../components/structure/Notification/Notification.svelte";
	import PopUp from "../../components/composite/PopUp/PopUp.svelte";
	import Cover from "../../components/structure/Cover/Cover.svelte";
	import Button from "../../components/elements/Button/Button.svelte";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";

	/**
	 * @var {URLSearchParams} urlParams URL parameters
	 */
	const urlParams = new URLSearchParams(window.location.search);
	/**
	 * @var {number} chatId ID of the chat to join (retrieved from the URL)
	 */
	const chatId: number = parseInt(urlParams.get("chatId") || "-1");
	/**
	 * @var {User|null} currentUser Currently logged in user
	 */
	const currentUser: User | null = authentifier.getStoredUser();
	/**
	 * @var {Chat|null} chat Chat to join
	 */
	let chat: Chat | null;
	/**
	 * @var {boolean} joining Indicates if the user is currently joining the chat
	 */
	let joining: boolean = false;
	/**
	 * @var {boolean} isAlreadyMember Indicates if the user is already a member of the chat
	 */
	let isAlreadyMember: boolean = false;

	/**
	 * Check if the user is already a member of the chat
	 *
	 * @return {Promise<boolean>} Returns true if the user is already a member of the chat
	 */
	async function checkIfAlreadyMember(): Promise<boolean> {
		try {
			if (!chat) {
				throw new Error("The chat has not been loaded!");
			}
			if (!currentUser) {
				throw new Error("The user is not logged in!");
			}
			return await dataLogic.isUserInChat(currentUser, chat);
		} catch (error: any) {
			debug.consoleLog(
				"Unable to check if the user is already a member of chat " +
					chatId +
					" : " +
					error,
				debug.Level.ERROR
			);
		}
		return false;
	}

	/**
	 * Retrieve the chat to join
	 *
	 * @param {number} id ID of the chat to retrieve
	 *
	 * @return {Promise<Chat>} Returns the chat to join
	 */
	async function getChat(id: number): Promise<Chat> {
		try {
			const chat = await dataLogic.getChat(id);
			if (chat !== null) {
				return chat;
			} else {
				throw new Error("An error occurred on the server");
			}
		} catch (error: any) {
			debug.consoleLog(
				"Unable to retrieve chat " +
					(id === -1 ? "without parameters " : id) +
					" : " +
					error,
				debug.Level.ERROR
			);
			throw error;
		} finally {
			chat = null;
		}
	}

	/**
	 * Join the chat
	 * 
	 * @return {Promise<void>}
	 */
	async function joinChat(): Promise<void> {
		joining = true;
		try {
			if (!chat) {
				throw new Error("The chat has not been loaded!");
			}
			if (!currentUser) {
				throw new Error("The user is not logged in!");
			}
			if (await dataLogic.joinChat(currentUser, chat)) {
				debug.consoleLog(
					"The user " +
						currentUser.getId() +
						" has joined chat " +
						chatId,
					debug.Level.INFO
				);
			} else {
				debug.consoleLog(
					"The user " +
						currentUser.getId() +
						" was already a member of chat " +
						chatId,
					debug.Level.INFO
				);
			}
			routing.goToPage(routing.appRoutes.chat, {id: chatId});
		} catch (error: any) {
			debug.consoleLog(
				"Unable to join chat " +
					chatId +
					" : " +
					error.message,
				debug.Level.ERROR
			);
		} finally {
			joining = false;
		}
	}

	onMount(async () => {
		chat = await getChat(chatId);
		if (chat) {
			isAlreadyMember = await checkIfAlreadyMember();
		}
	});
</script>

{#if currentUser === null}
	<Notification type="error"
		>You must be logged in to join a chat!</Notification
	>
	<Button
		on:click={() => {
			routing.goToPage(routing.appRoutes.login);
		}}>Log in</Button
	>
{:else if chat === undefined}
	<Notification type="info"
		>Data is loading...<Spinner /></Notification
	>
{:else if chat === null}
	{#if chatId < 0 || isNaN(chatId)}
		<Notification type="error"
			>The link you provided to join a chat is invalid!</Notification
		>
	{:else}
		<Notification type="error"
			>The chat you are looking for does not exist!</Notification
		>
	{/if}
{:else if isAlreadyMember}
	<Notification type="info"
		>You are already a member of chat {chat.getName()}!</Notification
	>
	<Button
		on:click={() => {
			routing.goToPage(routing.appRoutes.chat, {id: chatId});
		}}>Access the chat</Button
	>
{:else}
	<h1>{chat.getName()}</h1>
	<Notification type="success"
		>You have been invited to join chat {chat.getName()}!
		<br />
		Click the "Join" button on the displayed pop-up to access the chat
	</Notification>

	<Cover>
		<PopUp
			title="Chat Invitation"
			showCloseButton={true}
			on:close={() => {
				routing.goToPage(routing.appRoutes.home);
			}}
		>
			{#if joining}
				<Notification type="warning"
					>Please wait while we try to add you to the chat...<Spinner /></Notification
				>
			{:else}
				<Notification type="success"
					>You have been invited to join chat {chat.getName()}!</Notification
				>
				<Button
					on:click={() => {
						joinChat();
					}}>Join</Button
				>
			{/if}
		</PopUp>
	</Cover>
{/if}
