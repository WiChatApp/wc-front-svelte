<script lang="ts">
	import { Message } from "../../../common/classes/Message";
	import DropdownIcon from "../../elements/icons/menus/ArrowDownIcon.svelte";
	import Spinner from "../../elements/icons/menus/Spinner/Spinner.svelte";
	import { createEventDispatcher } from "svelte";

	/**
	 * @var {Message} message The message to display
	 */
	export let message: Message;
	/**
	 * @var {boolean} isAuthor Indicates if the user is the author of the message
	 */
	export let isAuthor: boolean = false;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Propagate the dropdown click event,
	 * accessible via on:dropdownClick={} when calling the component
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchDropdownClick(event: MouseEvent): boolean {
		return dispatch("dropdownClick", event);
	}
</script>

<div
	class="message {isAuthor ? 'author' : 'other'}{message.getId() === null
		? 'sending'
		: ''}"
>
	<div class="message-header">
		<h1>{message.getUser()?.getNickname()}</h1>
		{#if message.getId() === null}
			<button class="message-header-icon">
				<Spinner />
			</button>
		{:else}
			<button
				class="message-header-icon dropdown"
				on:click={dispatchDropdownClick}
			>
				<DropdownIcon />
			</button>
		{/if}
	</div>
	<div class="message-content">
		{message.getContent()}
	</div>
	<div class="message-time">
		{message.getPostDate()?.toLocaleString()}
	</div>
</div>

<style>
	@import "./Message.scss";
</style>
