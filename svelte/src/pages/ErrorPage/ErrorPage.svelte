<script lang="ts">
	import * as HTTPInterface from "../../common/tools/HTTPInterface";

	/** 
	 * @var {HTTPInterface.HTTPCode} code HTTP error code
	 */
	export let code : HTTPInterface.HTTPCode = 404;

	let message : string = HTTPInterface.HTTP_MESSAGES[code];
</script>

<h2>Error {code}</h2>
<p>{message}</p>
