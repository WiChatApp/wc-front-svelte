<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Propagate the click event to the parent,
	 * to react via on:click={} when the component is called
	 * 
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchClick() : boolean {
		return dispatch('click');
	}

	export let icon : any = null;
</script>

<style>
	@import "./Button.scss";
</style>

<button class="button" on:click={dispatchClick}>
	{#if icon}
		<span class="button-icon">
			<svelte:component this={icon} />
		</span>
	{/if}
	<span class="button-text">
	<slot></slot>
	</span>
</button>