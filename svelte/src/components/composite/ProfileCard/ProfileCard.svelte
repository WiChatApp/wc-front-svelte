<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import AccountIcon from "../../elements/icons/menus/AccountIcon.svelte";
	import LessIcon from "../../elements/icons/menus/LessIcon.svelte";

	/**
	 * @var {string} nickname The user's nickname
	 */
	export let nickname: string;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Dispatch the close event,
	 * to react via on:close={} when the component is called
	 * 
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchClose(): boolean {
		return dispatch("close");
	}

	/**
	 * Dispatch the clickName event on the card,
	 * to react via on:clickName={} when the component is called
	 * 
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchClick(): boolean {
		return dispatch("clickName");
	}

</script>

<div class="profile-card">
	<button class="profile-card-content" on:click={dispatchClick} tabindex="0">
		<div class="avatar">
			<AccountIcon />
		</div>
		<div class="username">
			<h1>{nickname}</h1>
		</div>
	</button>
	<button class="disconnect" on:click={dispatchClose}>
		<LessIcon />
	</button>
</div>

<style lang="scss">
	@import "./ProfileCard.scss";
</style>
