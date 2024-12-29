<script lang="ts">
	import { User } from "../../common/classes/User";
	import { Chat } from "../../common/classes/Chat";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { appRoutes, goToPage } from "../../common/tools/_routing";
	import Card from "../../components/composite/Card/Card.svelte";
	import ArrowRightIcon from "../../components/elements/icons/menus/ArrowRightIcon.svelte";
	import Input from "../../components/elements/Input/Input.svelte";
	import SearchIcon from "../../components/elements/icons/menus/SearchIcon.svelte";
	import * as store from "../../common/tools/_store";
	import * as debug from "../../common/tools/_debug";
	import * as dataLogic from "./dataLogic";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";
	import Notification from "../../components/structure/Notification/Notification.svelte";
	import { FlatToast, ToastContainer, toasts } from "svelte-toasts";
	import { createToast } from "../../common/tools/_utils";

	/**
	 * @var {User|null} storedUser Currently logged-in user
	 */
	let storedUser: User | null = get(store.currentUser);
	/**
	 * @var {Chat[]} chatList List of chats
	 */
	let chatList: Chat[] = [];
	/**
	 * @var {Chat[]} filteredChatList Filtered list of chats
	 */
	let filteredChatList: Chat[] = [];
	/**
	 * @var {boolean} isLoadingChats Indicates if chats are loading
	 */
	let isLoadingChats: boolean = true;
	/**
	 * @var {string} errorMessage Error message
	 */
	let errorMessage = "";
	/**
	 * @var {string} searchFilter Search filter
	 */
	let searchFilter = "";

	/**
	 * Retrieve the list of existing chats
	 *
	 * @returns {Promise<Chat[]>}
	 */
	async function getChatList(): Promise<Chat[]> {
		try {
			isLoadingChats = true;
			if (storedUser) {
				return await dataLogic.getChats();
			}
		} catch (error: any) {
			debug.consoleLog(
				"Unable to retrieve chats: " + error.message,
				debug.Level.ERROR
			);
		} finally {
			isLoadingChats = false;
		}
		return [];
	}

	/**
	 * Retrieve the filtered list of chats
	 *
	 * @param {string} value Search value
	 *
	 * @returns {Chat[]} Filtered list of chats
	 */
	function getFilteredChatList(value: string): Chat[] {
		return chatList.filter((chat) => {
			return chat.getName()?.toLowerCase().includes(value.toLowerCase());
		});
	}

	onMount(async () => {
		chatList = await getChatList();
		filteredChatList = getFilteredChatList(searchFilter);
	});

	$: {
		// Each time the search value changes, filter the list of chats
		filteredChatList = getFilteredChatList(searchFilter);
	}
</script>

<Input
	type="search"
	placeholder="Search for a chat"
	icon={SearchIcon}
	bind:value={searchFilter}
/>

{#if isLoadingChats}
	<Notification type="info">Loading chats... <Spinner /></Notification
	>
{:else}
	<div class="grid-container">
		{#if errorMessage}
			<p>{errorMessage}</p>
		{:else}
			{#each filteredChatList as chat (chat.getId())}
				<div class="card-container">
					<Card
						title={chat.getName() ?? "Chat" + chat.getId()}
						icon={ArrowRightIcon}
						on:titleClick={() =>
							goToPage(
								appRoutes.join,
								{ chatId: chat.getId() }
							)}
						on:settingsClick={() => {
							toasts.add(createToast(
								"This feature is not available yet!",
								"Error",
								10000,
								"error"
							));
						}}
					>
						<p>
							Click <a
								href={appRoutes.join.path +
									"/?chatId=" +
									chat.getId()}>here</a
							> to join the chat
						</p>
					</Card>
				</div>
			{/each}
		{/if}
	</div>
{/if}

<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	@import "./SearchPage.scss";
</style>
