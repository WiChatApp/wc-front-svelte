<script lang="ts">
	import { User } from "../../common/classes/User";
	import { Chat } from "../../common/classes/Chat";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { appRoutes, goToPage } from "../../common/tools/_routing";
	import * as store from "../../common/tools/_store";
	import * as debug from "../../common/tools/_debug";
	import * as dataLogic from "./dataLogic";
	import Card from "../../components/composite/Card/Card.svelte";
	import Button from "../../components/elements/Button/Button.svelte";
	import MoreIcon from "../../components/elements/icons/menus/MoreIcon.svelte";
	import ArrowRightIcon from "../../components/elements/icons/menus/ArrowRightIcon.svelte";
	import Cover from "../../components/structure/Cover/Cover.svelte";
	import PopUp from "../../components/composite/PopUp/PopUp.svelte";
	import Input from "../../components/elements/Input/Input.svelte";
	import Notification from "../../components/structure/Notification/Notification.svelte";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";
	import { FlatToast, ToastContainer, toasts } from "svelte-toasts";
	import OptionGroup from "../../components/composite/OptionGroup/OptionGroup.svelte";
	import type { OptionProps } from "../../components/elements/Option/OptionInterface";
	import CrossIcon from "../../components/elements/icons/menus/CrossIcon.svelte";
	import { createToast } from "../../common/tools/_utils";

	/**
	 * @var {User|null} storedUser Connected user
	 */
	let storedUser: User | null = get(store.currentUser);
	/**
	 * @var {Chat[]} chatList List of user's chats
	 */
	let chatList: Chat[] = [];
	/**
	 * @var {boolean} showCreationPopUp Show or hide the chat creation pop-up
	 */
	let showCreationPopUp = false;
	/**
	 * @var {string} inputChatName Name of the chat to create
	 */
	let inputChatName: string = "";
	/**
	 * @var {boolean} isLoadingChats Indicates if chats are being loaded
	 */
	let isLoadingChats: boolean = true;
	/**
	 * @var {boolean} isCreatingChat Indicates if the chat is being created
	 */
	let isCreatingChat: boolean = false;
	/**
	 * @var {Chat|null} selectedChat Selected chat to display options or null if no chat is selected
	 */
	let selectedChat: Chat | null = null;
	/**
	 * @var {OptionProps[]} chatOptions Options of the selected chat
	 */
	let chatOptions: OptionProps[] = [];

	/**
	 * Retrieve the list of chats of the connected user
	 * 
	 * @returns {Promise<Chat[]>} List of user's chats
	 */
	async function getChatList(): Promise<Chat[]> {
		chatList = [];
		try {
			if (!storedUser) {
				throw new Error("You are not logged in");
			}
			isLoadingChats = true;
			chatList = await dataLogic.getUserChats(storedUser);
		} catch (error: any) {
			debug.consoleLog(
				"An error occurred while retrieving the chat list: " +
					error,
				debug.Level.ERROR
			);
			toasts.add(createToast(
				"Unable to retrieve the chat list",
				"Error",
				10000,
				"error"
			));
		} finally {
			isLoadingChats = false;
		}
		return chatList;
	}

	/**
	 * Show or hide the chat creation pop-up
	 *
	 * @param {boolean | null} show Show or hide the pop-up (null or nothing to toggle the current state)
	 * 
	 * @returns {void}
	 */
	function toggleCreationPopUp(show: boolean = !showCreationPopUp) : void {
		showCreationPopUp = show;
	}

	/**
	 * Create a chat
	 *
	 * @returns {Promise<Chat|null>} The created chat or null in case of error
	 */
	async function createChat(): Promise<Chat | null> {
		try {
			if (!storedUser) {
				throw new Error("You are not logged in");
			}
			isCreatingChat = true;
			const createdChat = await dataLogic.createChat(
				storedUser,
				inputChatName
			);
			if (!createdChat) {
				throw new Error("The chat could not be created");
			}
			toasts.add(createToast(
				'Chat "' + createdChat.getName() + '" created successfully',
				"Success",
				5000,
				"success"
			));
			toggleCreationPopUp(false);

			return createdChat;
		} catch (error: any) {
			debug.consoleLog(
				"An error occurred while creating the chat: " +
					error,
				debug.Level.ERROR
			);
			toasts.add(createToast(
				"Unable to create the chat: " + error.message,
				"Error",
				10000,
				"error"
			));
			return null;
		} finally {
			isCreatingChat = false;
			// Refresh the chat list
			getChatList();
		}
	}

	/**
	 * Leave a chat
	 *
	 * @param {Chat} chat The chat to leave
	 * @param {User} user The user leaving the chat
	 * 
	 * @returns {Promise<void>}
	 */
	async function leaveChat(chat: Chat, user: User) : Promise<void> {
		try {
			const userRemoved: boolean = await dataLogic.removeChatUser(
				chat,
				user
			);
			if (!userRemoved) {
				throw new Error("You are not part of this chat!");
			} else {
				toasts.add(createToast(
					'You have left the chat "' + chat.getName() + '"',
					"Success",
					5000,
					"success"
				));
			}
		} catch (error: any) {
			debug.consoleLog(
				"An error occurred while leaving the chat: " + error,
				debug.Level.ERROR
			);
			toasts.add(createToast(
				"Unable to leave the chat",
				"Error",
				10000,
				"error"
			));
			throw error;
		} finally {
			// Refresh the chat list
			getChatList();
		}
	}

	/**
	 * Show member settings
	 * 
	 * @param {CustomEvent<any>} event Click event (containing a mouse event)
	 */
	function showChatSettings(event: CustomEvent<any>, chat: Chat | null) {
		// If the chat is null or if the chat is already selected
		// deselect the chat (which closes the dropdown menu)
		if (chat == null || chat === selectedChat) {
			selectedChat = null;
			return;
		}

		selectedChat = chat;

		chatOptions = [];
		chatOptions.push({
			text: "Leave the chat " + selectedChat.getName(),
			icon: CrossIcon,
			handleClick: (e: CustomEvent<MouseEvent>) => {
				if (selectedChat && storedUser) {
					leaveChat(selectedChat, storedUser);
					// Deselect the chat to close the dropdown menu
					selectedChat = null;
				} else
				toasts.add(createToast(
						"Unable to leave the chat",
						"Error",
						10000,
						"error"
					));
			},
		});

		// Coordinates of the click origin
		const rect = event.detail.target.getBoundingClientRect();
		const originLeft: number = rect.left;
		const originTop: number = rect.top + window.scrollY;
		const originSize: number = rect.width;
		// Display the menu at the click coordinates
		const chatSettings: HTMLElement | null =
			document.querySelector(".chat-settings");
		if (chatSettings) {
			chatSettings.style.left = originLeft + originSize + "px";
			chatSettings.style.top = originTop + "px";
		}
	}

	onMount(async () => {
		if (storedUser) {
			chatList = await getChatList();
		}
	});

	// If the value of currentUser becomes null, redirect the user to the login page
	$: if (storedUser === null) {
		goToPage(appRoutes.login);
	}
</script>

{#if !storedUser}
	<!-- This case should not happen, since the user is supposed to be redirected 
		to the authentication page, but we still protect the page content as a precaution -->
	<p>
		You are not logged in! <a href={appRoutes.login.path}
			>Log in</a
		>
	</p>
{:else}
	<p>You are logged in as {storedUser.getNickname()}</p>

	<div class="actions">
		<div class="add-button">
			<Button
				icon={MoreIcon}
				on:click={() => {
					toggleCreationPopUp(true);
				}}
			>
				Create a chat
			</Button>
		</div>
	</div>

	<div class="grid-container">
		{#if isLoadingChats}
			<Notification type="info"
				>Loading chats...<Spinner /></Notification
			>
		{:else if chatList.length === 0}
			<p>You don't have any chats yet</p>
		{:else}
			{#each chatList as chat (chat.getId())}
				<div class="card-container">
					<Card
						title={chat.getName() ?? "Chat" + chat.getId()}
						icon={ArrowRightIcon}
						on:titleClick={() =>
							goToPage(
								appRoutes.chat, { id: chat.getId() }
							)}
						on:settingsClick={(event) =>
							showChatSettings(event, chat)}
					>
						<p>
							Click <a
								href={appRoutes.chat.path +
									"/?id=" +
									chat.getId()}>here</a
							> to access the chat
						</p>
					</Card>
				</div>
			{/each}
		{/if}
	</div>
	{#if showCreationPopUp}
		<Cover>
			<div class="content">
				<PopUp
					title="Chat Creation"
					on:close={() => {
						toggleCreationPopUp(false);
					}}
				>
					<form
						on:submit|preventDefault={async () => {
							await createChat();
						}}
					>
						{#if isCreatingChat}
							<Notification type="warning"
								>Creating chat...<Spinner
								/></Notification
							>
						{:else}
							<label for="chatname">Chat Name</label>
							<Input
								type="text"
								placeholder="Chat Name"
								name="chatname"
								icon={MoreIcon}
								bind:value={inputChatName}
							/>
							<div class="creation-btn">
								<Button>Create</Button>
							</div>
						{/if}
					</form>
				</PopUp>
			</div>
		</Cover>
	{/if}
{/if}

<div class="chat-settings">
	{#if selectedChat}
		<OptionGroup options={chatOptions} />
	{/if}
</div>

<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	@import "./HomePage.scss";
</style>
