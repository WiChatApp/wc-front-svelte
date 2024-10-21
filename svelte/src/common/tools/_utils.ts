import type { ToastType } from "svelte-toasts/types/common";

/**
 * Check if two objects are equal
 *
 * @param {any} a Object to compare
 * @param {any} b Object to compare
 *
 * @returns {boolean} true if the objects are equal, false otherwise
 */
export function isEqual(a: any, b: any): boolean {
	return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Display a toast notification
 *
 * @param {string} message Toast message
 * @param {string} title Toast title
 * @param {number} duration Toast display duration
 * @param {ToastType} type Toast type
 *
 * @returns {object} Toast object
 */
export function createToast(
	message: string,
	title: string,
	duration: number,
	type: ToastType
): object {
	return {
		title: title,
		description: message,
		duration: duration,
		placement: "bottom-right",
		type: type,
		theme: "dark",
		showProgress: true,
		onClick: () => {},
		onRemove: () => {},
	};
}

/**
 * Focus on the first focusable element in this component
 * 
 * @param {Element | null | undefined} parentElement Parent element in which to search for the first focusable element
 * 
 * @returns {void}
 */
export function focusOnFirstElement(parentElement: Element): void {
	const firstFocusable: Element | null | undefined = parentElement.querySelector(
			"button, [href], input, select, textarea, [tabindex]:not([tabindex='-1']"
		);
	if (firstFocusable) {
		(firstFocusable as HTMLElement).focus();
	}
}