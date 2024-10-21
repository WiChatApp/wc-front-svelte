<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { Assignation } from "../../../common/classes/Assignation";
	import SettingsIcon from "../../elements/icons/menus/SettingsIcon.svelte";
	import { Permission } from "../../../common/classes/Permission";
	import { Role } from "../../../common/classes/Role";
	import ColorIcon from "../../elements/icons/menus/ColorIcon/ColorIcon.svelte";
	import type { ColorIconType } from "../../elements/icons/menus/ColorIcon/ColorIconInterface";

	/**
	 * @var {Assignation} assignation The assignation to display
	 */
	export let assignation: Assignation;

	/**
	 * @var {EventDispatcher} dispatch Event dispatcher
	 */
	const dispatch = createEventDispatcher();

	/**
	 * Propagate the pop-up close event,
	 * to react via on:settingsClick={} when the component is called
	 *
	 * @param {MouseEvent} event Mouse event
	 *
	 * @returns {boolean} Returns false if the event was stopped
	 */
	function dispatchSettingsClick(event: MouseEvent): boolean {
		return dispatch("settingsClick", event);
	}

	let iconColor : ColorIconType;
	switch (assignation.getPermission()?.getType()) {
		case Permission.TYPE.ALLOWED.getType():
			iconColor = "green";
			break;
		case Permission.TYPE.MUTED.getType():
			iconColor = "red";
			break;
		case Permission.TYPE.BANNED.getType():
			iconColor = "black";
			break;
		default:
			iconColor = "green";
			break;
	}
</script>

<div class="member">
	<span class="member-name"
		><h1>
			{assignation.getUser()?.getNickname()}{assignation
				.getRole()
				?.getId() == Role.TYPE.ADMIN.getId()
				? " (Admin)"
				: ""}
		</h1></span
	>

	<span class="member-infos">
		<span class="member-infos-status"
			><h2>{assignation.getPermission()?.getType()}</h2></span
		>
		<span
			class="member-infos-status-icon"
			title={assignation.getPermission()?.getType()}
		>
			<ColorIcon color={iconColor} />
		</span>
		<button class="member-infos-actions" on:click={dispatchSettingsClick}>
			<SettingsIcon />
		</button>
	</span>
</div>

<style>
	@import "./Member.scss";
</style>
