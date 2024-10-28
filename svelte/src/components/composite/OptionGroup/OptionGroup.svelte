<style>
	@import "./OptionGroup.scss";
</style>

<script lang="ts">
	import { onMount } from "svelte";
	import Option from "../../elements/Option/Option.svelte";
	import type { OptionProps } from "../../elements/Option/OptionInterface.ts";
	import { focusOnFirstElement } from "../../../common/tools/_utils";
	
	/**
	 * @var {OptionProps[]} options The properties of the options to display
	 */
	export let options : OptionProps[] = [];

	onMount(() => {
		const optionGroup = document.getElementById("option-group");
		if(optionGroup) focusOnFirstElement(optionGroup);
	});
</script>

<div class="option-group" id="option-group">
	{#each options as option}
		<div class="option-group-item">
			<Option icon="{option.icon ?? null}" on:click={option.handleClick ?? (() => {})}>
				{option.text}
			</Option>
		</div>
	{/each}
</div>