<script lang="ts">
	import { createEventDispatcher, tick } from "svelte";
	import SettingsIcon from "../../elements/icons/menus/SettingsIcon.svelte";
	import Input from "../../elements/Input/Input.svelte";
	import Member from "../Member/Member.svelte";
	import MessageComponent from "../Message/Message.svelte";
	import type { Assignment } from "../../../common/classes/Assignment";
	import PointerIcon from "../../elements/icons/menus/PointerIcon.svelte";
	import type { Chat } from "../../../common/classes/Chat";
	import type { User } from "../../../common/classes/User";
	import { Message } from "../../../common/classes/Message";

	/**
	 * @var {Chat} chat The current chat
	 */
	export let chat: Chat;
	/**
	 * @var {User} watchingUser The user watching the chat
	 */
	export let watchingUser: User | null = null;
	/**
	 * @var {Assignment[]} assignments The chat assignments
	 */
	let assignments: Assignment[] | null;
	/**
	 * @var {Message[]} messages The chat messages
	 */
	let messages: Message[] | null;
	/**
	 * @var {number} msgCount The number of messages (stored separately to detect changes in messages)
	 */
	let msgCount = 0;
	/**
	 * @var {string} msgToSend The message to send
	 */
	let msgToSend: string = "";

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Dispatch the message send event,
	 * to react via on:messageSend={} when the component is called
	 * 
	 * @param {string} msg The message to send
	 *
	 * @returns {boolean}
	 */
	function dispatchMessageSend(msg: string): boolean {
		// Create a fake message to display while sending
		const visualMsg = new Message(
			null,
			msg,
			new Date(),
			chat,
			watchingUser
		);
		chat.addMessage(visualMsg);
		// To update the component, the variable needs to be reassigned
		chat = chat;

		const dispatchReturn = dispatch("messageSend", msg);
		msgToSend = "";
		return dispatchReturn;
	}

	/**
	 * Dispatch the chat settings click event,
	 * to react via on:settingsClick={} when the component is called
	 *
	 * @param {MouseEvent} event Mouse event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchSettingsClick(event: MouseEvent): boolean {
		return dispatch("settingsClick", event);
	}

	/**
	 * Dispatch the member settings click event,
	 * to react via on:memberSettingsClick={} when the component is called
	 *
	 * @param {CustomEvent<MouseEvent>} event The click event (containing the member's click event)
	 * @param {Assignment} assignment The member's assignment
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchMemberSettingsClick(
		event: CustomEvent<MouseEvent>,
		assignment: Assignment
	): boolean {
		return dispatch("memberSettingsClick", { event, assignment });
	}

	/**
	 * Dispatch the message dropdown click event,
	 * to react via on:msgDropdownClick={} when the component is called
	 *
	 * @param {CustomEvent<MouseEvent>} event The click event (containing the dropdown's click event)
	 * @param {Message} message The message
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchMsgDropdownClick(
		event: CustomEvent<MouseEvent>,
		message: Message
	): boolean {
		return dispatch("msgDropdownClick", { event, message });
	}

	/**
	 * Scroll the message list to the bottom when the DOM is updated
	 * 
	 * @returns {void}
	 */
	function scrollDownMsgList() : void {
		tick().then(() => {
			const msgList = document.getElementById("msgList");
			if (msgList) {
				msgList.scrollTop = msgList.scrollHeight;
			}
		});
	}

	$: {
		if (chat) {
			messages = chat.getMessages();
			if (messages) {
				// If the number of messages has changed, scroll the list
				if (messages && msgCount < messages.length) {
					msgCount = messages.length;
					scrollDownMsgList();
				}
			}
			
			assignments = chat.getAssignments();
		}
	}
</script>

<div class="chat">
	<div class="chat-messages">
		<div class="chat-messages-header">
			<h1>Messages</h1>
			<button
				class="chat-messages-header-settings"
				on:click={dispatchSettingsClick}
			>
				<SettingsIcon />
			</button>
		</div>
		<div class="chat-messages-list">
			{#if messages}
				{#if messages.length === 0}
					<p>There are no messages in this chat.</p>
				{:else}
					{#each messages as msg}
						<div
							class="chat-messages-list-message {msg
								.getUser()
								?.getId() === watchingUser?.getId()
								? 'sent'
								: 'received'}"
						>
							<div class="container">
								<MessageComponent
									on:dropdownClick={(event) => {
										dispatchMsgDropdownClick(event, msg);
									}}
									isAuthor={msg.getUser()?.getId() ===
										watchingUser?.getId()}
									message={msg}
								/>
							</div>
						</div>
					{/each}
				{/if}
			{:else}
				<p>Unable to retrieve messages from this chat.</p>
			{/if}
		</div>
		<div class="chat-messages-send">
			<Input
				bind:value={msgToSend}
				on:submit={() => dispatchMessageSend(msgToSend)}
				placeholder="Send a message..."
				icon={PointerIcon}
			/>
		</div>
	</div><!-- Remove the empty space --><div class="chat-members">
		<div class="chat-members-header">
			<h1>Members</h1>
		</div>
		<div class="chat-members-list" id="msgList">
			{#if assignments}
				{#if assignments.length === 0}
					<p>There are no members in this chat.</p>
				{:else}
					{#each assignments as assignment}
						<Member
							{assignment}
							on:settingsClick={(event) => {
								dispatchMemberSettingsClick(event, assignment);
							}}
						/>
					{/each}
				{/if}
			{:else}
				<p>Unable to retrieve members from this chat.</p>
			{/if}
		</div>
	</div>
</div>

<style>
	@import "./Chat.scss";
</style>
