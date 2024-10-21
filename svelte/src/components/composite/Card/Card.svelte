<script lang="ts">
	import SettingsIcon from "../../elements/icons/menus/SettingsIcon.svelte";
	import HelpIcon from "../../elements/icons/menus/HelpIcon.svelte";
	import { createEventDispatcher } from "svelte";

	/**
	 * @var {string} title Card title
	 */
	export let title: string;
	/**
	 * @var {typeof SvelteComponent} icon Component constructor for the icon or null if no icon is defined
	 * (any here actually corresponds to typeof SvelteComponent, but this type causes TS compilation issues)
	 */
	export let icon: any | null = null;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Propagate the title click event,
	 * to react via on:titleClick={} when the component is called
	 * 
	 * @param {MouseEvent} event Mouse event
	 * 
	 * @return {boolean} Returns false if the event was stopped
	 */
	function dispatchTitleClick(event: MouseEvent): boolean {
		return dispatch("titleClick", event);
	}

	/**
	 * Propagate the settings button click event,
	 * to react via on:settingsClick={} when the component is called
	 * 
	 * @param {MouseEvent} event Mouse event
	 * 
	 * @return {boolean} Returns false if the event was stopped
	 */
	function dispatchSettingsClick(event: MouseEvent): boolean {
		return dispatch("settingsClick", event);
	}
</script>

<div class="card">
	<div class="card-header">
		<button class="card-header-title" on:click={dispatchTitleClick}>
			<div class="card-header-title-icon">
				{#if icon}
					<svelte:component this={icon} />
				{:else}
					<HelpIcon />
				{/if}
			</div>
			<h1>{title}</h1>
		</button>
		<button class="card-header-settings" on:click={dispatchSettingsClick}>
			<SettingsIcon />
		</button>
	</div>
	<div class="card-content"><slot /></div>
</div>

<style>
	@import "./Card.scss";
</style>
