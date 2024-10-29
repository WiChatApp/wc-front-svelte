<script lang="ts">
	import CrossIcon from "../../elements/icons/menus/CrossIcon.svelte";
	import { createEventDispatcher } from "svelte";

	/**
	 * @var {string} title Title of the pop-up
	 */
	export let title: string;
	/**
	 * @var {boolean} showCloseButton Whether to show the close button of the pop-up
	 */
	export let showCloseButton: boolean = true;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Dispatch the close event of the pop-up,
	 * to react via on:close={} when the component is called
	 * 
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchClose(): boolean {
		return dispatch("close");
	}
</script>

<div class="pop-up">
	<div class="title">
		<h1>{title}</h1>
		{#if showCloseButton}
			<button class="close" on:click={dispatchClose}>
				<CrossIcon />
			</button>
		{/if}
	</div>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	@import "./PopUp.scss";
</style>
