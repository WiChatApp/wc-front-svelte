// This interface should be used for option groups that use
// property arrays to instantiate options

import type { ColorIconType } from "../icons/menus/ColorIcon/ColorIconInterface";

/**
 * Option properties
 */
export interface OptionProps {
	// any actually represents a Svelte component constructor
	// but it is (possibly) impossible to type it correctly
	icon?: any | ColorIconType | null;
	text: string;
	handleClick?: (event: CustomEvent<MouseEvent>) => any;
};