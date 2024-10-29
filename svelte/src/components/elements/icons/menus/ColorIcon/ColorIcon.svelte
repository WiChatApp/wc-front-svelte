<style>
	@import "./ColorIcon.scss";
</style>

<script lang="ts">
	/** 
	 * @var {ColorIconType} color The color of the icon
	 * (string actually corresponds to ColorIconType here, but this type causes TS compilation issues)
	 */
	export let color: string = "black";
</script>
<span class="color {color}"></span>