<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import ColorIcon from "../icons/menus/ColorIcon/ColorIcon.svelte";

	/**
	 * @var {ColorIconType} icon If a string is passed, displays a ColorIcon of that color
	 * (string here actually corresponds to ColorIconType, but this type causes TS compilation issues)
	 * @var {typeof SvelteComponent} icon Component constructor for the icon or null if no icon is defined
	 * (any here actually corresponds to typeof SvelteComponent, but this type causes TS compilation issues)
	 */
	export let icon: any | string | null = null;

	/** 
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();
	
	/**
	 * Propagate the pop-up close event
	 * 
	 * @param {MouseEvent} event Mouse event
	 * 
	 * @return {boolean} Returns false if the event was stopped
	 */
	function dispatchClick(event: MouseEvent): boolean {
		return dispatch("click", event);
	}
</script>

<button class="option" on:click={dispatchClick}>
	{#if icon !== null}
		<div class="option-icon">
			<!-- If the icon is a string, display a ColorIcon -->
			<!-- Otherwise, display the passed icon component -->
			{#if typeof icon === "string"}
				<ColorIcon color={icon} />
			{:else}
				<svelte:component this={icon} />
			{/if}
		</div>
	{/if}
	<span class="option-content">
		<slot />
	</span>
</button>

<style>
	@import "./Option.scss";
</style>
