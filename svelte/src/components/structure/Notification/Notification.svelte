<style>
	@import "./Notification.scss";
</style>
<script lang="ts">
	import type { NotificationType } from "./NotificationInterface";

	export let type: NotificationType = "info";
</script>
<div class="notification {type}">
	<slot></slot>
</div>