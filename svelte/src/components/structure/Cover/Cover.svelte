<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { focusOnFirstElement } from "../../../common/tools/_utils";

	/**
	 * @var {boolean} blockScroll Block or not the page scroll
	 */
	export let blockScroll: boolean = false;
	/**
	 * @var {Element[]} focusableElements List of focusable elements on the page
	 */
	let focusableElements: Element[] = [];

	onMount(() => {
		// Block the page scroll if necessary
		document.body.style.overflow = blockScroll ? "hidden" : "auto";

		const coverElement = document.querySelector("#cover");
		if(coverElement) focusOnFirstElement(coverElement);

		// Make all elements outside this component non-focusable
		focusableElements = Array.from(
			document.querySelectorAll(
				"button, [href], input, select, textarea, [tabindex]:not([tabindex='-1']"
			)
		);
		focusableElements.forEach((elmt) => {
			if (!document.querySelector("#cover")?.contains(elmt)) {
				elmt.setAttribute("tabindex", "-1");
			}
		});
	});

	onDestroy(() => {
		// Make all elements focusable again when the component is unmounted
		focusableElements.forEach((elmt) => {
			elmt.removeAttribute("tabindex");
		});
	});
</script>

<div class="cover" id="cover">
	<slot />
</div>

<style>
	@import "./Cover.scss";
</style>
