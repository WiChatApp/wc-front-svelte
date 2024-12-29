<script lang="ts">
	import ChatComponent from "../../components/composite/Chat/Chat.svelte";
	import { Chat } from "../../common/classes/Chat";
	import * as dataLogic from "./dataLogic";
	import * as debug from "../../common/tools/_debug";
	import * as authentifier from "../../common/tools/_auth";
	import type { User } from "../../common/classes/User";
	import { Role } from "../../common/classes/Role";
	import { onMount } from "svelte";
	import Notification from "../../components/structure/Notification/Notification.svelte";
	import { Assignment } from "../../common/classes/Assignment";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";
	import { FlatToast, ToastContainer, toasts } from "svelte-toasts";
	import OptionGroup from "../../components/composite/OptionGroup/OptionGroup.svelte";
	import AccountIcon from "../../components/elements/icons/menus/AccountIcon.svelte";
	import type { OptionProps } from "../../components/elements/Option/OptionInterface";
	import { createToast } from "../../common/tools/_utils";

	const urlParams: URLSearchParams = new URLSearchParams(
		window.location.search
	);
	/**
	 * @var {number} updateDelay Data refresh delay (in ms)
	 */
	const updateDelay: number = 5000;
	/**
	 * @var {Chat | undefined | null} chat The current chat (undefined means loading is not finished,
	 * null means the chat does not exist or cannot be retrieved)
	 */
	let chat: Chat | undefined | null;
	/**
	 * @var {Assignment[] | null} chatAssignments The chat assignments
	 * (used only to set the value of chat.getAssignments() when checking for nullity)
	 */
	let chatAssignments: Assignment[] | null;
	/**
	 * @var {User | null} selectedUser The user selected for settings
	 */
	let selectedUser: User | null = null;
	/**
	 * @var {OptionProps} userOptions The options to display for the selected user
	 */
	let userOptions: OptionProps[] = [];
	/**
	 * @var {User | null} connectedUser The connected user
	 */
	const connectedUser: User | null = authentifier.getStoredUser();
	/**
	 * @var {number} chatId The ID of the chat to retrieve (in the URL)
	 */
	const chatId: number = parseInt(urlParams.get("id") || "-1");

	/**
	 * Retrieve the chat
	 *
	 * @returns {Promise<Chat | undefined | null>} The retrieved chat, undefined in case of loading error
	 * or null if the chat does not exist
	 */
	async function getChat(): Promise<Chat | undefined | null> {
		try {
			const chat = await dataLogic.getChat(chatId);
			return chat;
		} catch (error: any) {
			const message: string =
				"Unable to retrieve chat data " +
				chatId +
				" : " +
				error.message;
			debug.consoleLog(message, debug.Level.ERROR);
			toasts.add(createToast(message, "Error", updateDelay, "error"));
			return undefined;
		}
	}

	/**
	 * Send a message in the chat
	 *
	 * @param {CustomEvent<string>} event The message event to send
	 * 
	 * @returns {Promise<void>}
	 */
	async function handleSendMessage(event: CustomEvent<string>) : Promise<void> {
		try {
			if (!chat)
				throw new Error(
					"The chat you want to send a message to does not exist!"
				);

			const messageContent: string = event.detail.trim();
			if (!messageContent || messageContent.length === 0) {
				throw new Error("You cannot send an empty message!");
			}
			const connectedUser = authentifier.getStoredUser();
			if (chat && connectedUser) {
				const createdMsg = await dataLogic.sendMessage(
					connectedUser,
					chat,
					messageContent
				);
				if (!createdMsg) {
					throw new Error(
						"The server returned a negative response"
					);
				} else {
					// Manually update the chat after sending the message
					chat = await getChat();
				}
			}
		} catch (error: any) {
			debug.consoleLog(
				"Unable to send the message in chat " +
					chat?.getId() +
					" : " +
					error,
				debug.Level.ERROR
			);
			toasts.add(createToast(
				"Unable to send the message: " + error.message,
				"Error",
				10000,
				"error"
			));
		}
	}

	/**
	 * Show member settings
	 *
	 * @param {CustomEvent<any>} event The member settings click event
	 * 
	 * @returns {void}
	 */
	function showUserSettings(event: CustomEvent<any>): void {
		// Retrieve the clicked member's assignment
		const assignment = event.detail.assignment;
		// If there is no assignment (which should not be possible), exit the process
		const assignments = chat?.getAssignments();
		if (!assignments) return;
		// If the connected user is not an admin of the chat, do nothing
		const currentUser = authentifier.getStoredUser();
		if (
			assignments
				.find(
					(chatAssignment) =>
						chatAssignment.getUser()?.getId() ==
						currentUser?.getId()
				)
				?.getRole()
				?.getId() != Role.TYPE.ADMIN.getId()
		) {
			toasts.add(createToast(
				"You cannot manage members if you are not an admin of the chat!",
				"Error",
				10000,
				"error"
			));
			return;
		}

		// If the assignment is null or if the clicked member has already been selected
		// deselect the member (which closes the dropdown menu)
		if (assignment == null || assignment.getUser() == selectedUser) {
			selectedUser = null;
			return;
		}
		const user = assignment.getUser();
		if (!user) {
			toasts.add(createToast(
				"Unable to retrieve the selected user's information",
				"Error",
				10000,
				"error"
			));
			return;
		}

		selectedUser = user;

		userOptions = [];
		if (assignment.getRole()?.getId() == Role.TYPE.GUEST.getId()) {
			userOptions.push({
				text: "Mute " + user.getNickname(),
				icon: "black",
				handleClick: (e: CustomEvent<MouseEvent>) => {
					toasts.add(createToast(
						"This feature is not yet available!",
						"Error",
						10000,
						"error"
					));
				},
			});
			userOptions.push({
				text: "Ban " + user.getNickname(),
				icon: "red",
				handleClick: (event: CustomEvent<MouseEvent>) => {
					toasts.add(createToast(
						"This feature is not yet available!",
						"Error",
						10000,
						"error"
					));
				},
			});
			userOptions.push({
				text:
					"Give the role " +
					Role.TYPE.ADMIN.getName() +
					" to " +
					user.getNickname(),
				icon: AccountIcon,
				handleClick: (event: CustomEvent<MouseEvent>) => {
					toasts.add(createToast(
						"This feature is not yet available!",
						"Error",
						10000,
						"error"
					));
				},
			});
		} else {
			if (assignment.getRole()?.getId() == Role.TYPE.ADMIN.getId()) {
				userOptions.push({
					text:
						"Give the role " +
						Role.TYPE.GUEST.getName() +
						" to " +
						user.getNickname(),
					icon: AccountIcon,
					handleClick: (event: CustomEvent<MouseEvent>) => {
						toasts.add(createToast(
							"This feature is not yet available!",
							"Error",
							10000,
							"error"
						));
					},
				});
			}
		}

		// Coordinates of the click origin
		const rect = event.detail.event.detail.target.getBoundingClientRect();
		const originLeft: number = rect.left;
		const originTop: number = rect.top + window.scrollY;
		const originSize: number = rect.width;
		// Display the menu at the click coordinates
		const memberSettings: HTMLElement | null =
			document.getElementById("member-settings");
		if (memberSettings) {
			memberSettings.style.left = originLeft + originSize + "px";
			memberSettings.style.top = originTop + "px";
		}
	}

	onMount(async () => {
		// Retrieve the chat when the page loads
		chat = await getChat();

		// If the chat is null, it means it does not exist, so we do not reload it
		if (chat !== null) {
			// Create a timer to refresh the data
			setInterval(async () => {
				debug.consoleLog(
					"Refreshing the chat",
					debug.Level.INFO
				);
				chat = await getChat();
			}, updateDelay);
		}
	});

	$: {
		// On each chat change, update the assignments
		if (chat) {
			chatAssignments = chat.getAssignments();
		}
	}
</script>

{#if connectedUser === null}
	<Notification type="error"
		>You must be logged in to join a chat!</Notification
	>
	<!-- As long as the chat is not a Chat object or null, it is loading -->
{:else if chat === undefined}
	<Notification type="info"
		>The chat is loading... <Spinner /></Notification
	>
{:else if chat == null}
	<Notification type="error"
		>The chat you are looking for does not exist!</Notification
	>
{:else}
	<h2>{chat.getName()}</h2>
	{#if chatAssignments && chatAssignments.some((assignment) => assignment
					.getUser()
					?.getId() === connectedUser.getId())}
		<div class="chat-element">
			<ChatComponent
				watchingUser={connectedUser}
				{chat}
				on:msgDropdownClick={(event) => {
					toasts.add(createToast(
						"This feature is not yet available!",
						"Error",
						10000,
						"error"
					));
				}}
				on:messageSend={handleSendMessage}
				on:settingsClick={(event) => {
					toasts.add(createToast(
						"This feature is not yet available!",
						"Error",
						10000,
						"error"
					));
				}}
				on:memberSettingsClick={showUserSettings}
			/>
		</div>
	{:else}
		<Notification type="error"
			>You are not a member of this chat!</Notification
		>
	{/if}
{/if}

<div class="member-settings" id="member-settings">
	{#if selectedUser}
		<OptionGroup options={userOptions} />
	{/if}
</div>

<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	@import "./ChatPage.scss";
</style>
