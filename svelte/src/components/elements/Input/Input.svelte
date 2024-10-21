<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { InputType } from "./InputInterface";

	/**
	 * @var {string} value The value of the input
	 */
	export let value: string = "";
	/**
	 * @var {string} id The identifier of the input, for JS or CSS processing
	 */
	export let id: string = "";
	/**
	 * @var {string} name The name of the input, for form processing
	 */
	export let name: string = "";
	/**
	 * @var {string} type The type of the input (text, number, password, email, tel, url, search)
	 */
	export let type: InputType = "text";
	export let placeholder: string = "Please enter text";
	export let icon: any = null;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();
	 
	/**
	 * Propagate the valueChange event to the parent,
	 * to react via on:valueChange={} when the component is called
	 *
	 * @param {Event & { target: HTMLInputElement }} event The input event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchInputValueChange(
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	): boolean {
		// Since value is a property of the component,
		// we need to dispatch it so the parent can retrieve it
		value = (event.target as HTMLInputElement)?.value;
		return dispatch("valueChange", value);
	}

	/**
	 * Propagate the valueChange event to the parent,
	 * to react via on:valueChange={} when the component is called
	 *
	 * @param {Event & { currentTarget: EventTarget & HTMLSelectElement }} event The input event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchSelectionChange(
		event: Event & { currentTarget: EventTarget & HTMLSelectElement }
	): boolean {
		// Since value is a property of the component,
		// we need to dispatch it so the parent can retrieve it
		value = (event.target as HTMLSelectElement)?.value;
		return dispatch("valueChange", value);
	}

	/**
	 * Propagate the valueChange event to the parent,
	 * to react via on:valueChange={} when the component is called
	 *
	 * @param {Event & { currentTarget: EventTarget & HTMLTextAreaElement }} event The input event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchTextAreaValueChange(
		event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }
	): boolean {
		// Since value is a property of the component,
		// we need to dispatch it so the parent can retrieve it
		value = (event.target as HTMLTextAreaElement)?.value;
		return dispatch("valueChange", value);
	}

	/**
	 * Propagate the submit event to the parent,
	 * to react via on:submit={} when the component is called
	 *
	 * @param {KeyboardEvent} event Keyboard event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchKeyDown(event: KeyboardEvent): boolean {
		// If the pressed key is "Enter", propagate the event
		if (event.key === "Enter") {
			return dispatch("submit", event);
		}
		return false;
	}

	/**
	 * Allow the parent to listen to the click event on the icon
	 *
	 * @param {MouseEvent} event Mouse event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchIconClick(event: MouseEvent): boolean {
		return dispatch("submit", event);
	}
</script>

<span class="input">
	<!-- The type of an input cannot be determined dynamically, we have to define it case by case -->
	{#if type === "number"}
		<input
			type="number"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "password"}
		<input
			type="password"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "email"}
		<input
			type="email"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "tel"}
		<input
			type="tel"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "url"}
		<input
			type="url"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "search"}
		<input
			type="search"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "text"}
		<input
			type="text"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "date"}
		<input
			type="date"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "time"}
		<input
			type="time"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "datetime-local"}
		<input
			type="datetime-local"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "month"}
		<input
			type="month"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "week"}
		<input
			type="week"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "color"}
		<input
			type="color"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "file"}
		<input
			type="file"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "hidden"}
		<input
			type="hidden"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "image"}
		<input
			type="image"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
			alt={placeholder}
		/>
	{:else if type === "range"}
		<input
			type="range"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "submit"}
		<input
			type="submit"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "reset"}
		<input
			type="reset"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "button"}
		<input
			type="button"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "checkbox"}
		<input
			type="checkbox"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "radio"}
		<input
			type="radio"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{:else if type === "select"}
		<select
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchSelectionChange}
			on:keydown={dispatchKeyDown}
		>
			<option value="" disabled selected hidden>{placeholder}</option>
		</select>
	{:else if type === "textarea"}
		<textarea
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchTextAreaValueChange}
			on:keydown={dispatchKeyDown}
		></textarea>
	{:else}
		<input
			type="text"
			class="input-field"
			{placeholder}
			{id}
			{name}
			bind:value
			on:input={dispatchInputValueChange}
			on:keydown={dispatchKeyDown}
		/>
	{/if}

	{#if icon}
		<button class="input-icon" on:click={dispatchIconClick}>
			<svelte:component this={icon} />
		</button>
	{/if}
</span>

<style>
	@import "./Input.scss";
</style>
