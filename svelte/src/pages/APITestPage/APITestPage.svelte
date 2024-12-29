<script lang="ts">
	import * as api from "../../common/tools/_api";

	/**
	 * Testable endpoints (entities)
	 */
	const ENDPOINTS: Record<any, string> = {
		TESTS: "tests",
		CHATS: "chats",
		MESSAGES: "messages",
		USERS: "users",
		ROLES: "roles",
		PERMISSIONS: "permissions",
		STATUSES: "statuses",
		ASSIGNATIONS: "assignments",
	};

	/**
	 * @var {any} responseJSON API response
	 */
	let responseJSON: any = {};
	/**
	 * @var {string} responseString API response as a string
	 */
	let responseString : string = "Choose an action to perform";
	/**
	 * @var {string} selectedAction Action to perform (see api.METHODS)
	 */
	let selectedAction: string = api.METHODS.GET;
	/**
	 * @var {string} selectedEntity Entity to manipulate (see ENDPOINTS)
	 */
	let selectedEntity: string = ENDPOINTS.TESTS;
	/**
	 * @var {string} selectedValue Value to send (for POST and PUT)
	 */
	let selectedValue: string = "Test value";
	/**
	 * @var {number} selectedId ID of the entity to manipulate (for GET, use 0 to retrieve all entities)
	 */
	let selectedId: number = 0;

	/**
	 * Triggers an action on an entity
	 * 
	 * @param {string} action Action to perform (see api.METHODS)
	 * @param {string} entity Entity to manipulate (see ENDPOINTS)
	 * @param {number} id ID of the entity to manipulate (for GET, use 0 to retrieve all entities)
	 * @param {string} value Value to send (for POST and PUT)
	 * 
	 * @return {Promise<void>}
	 */
	async function triggerAction(action: string, entity: string, id: number, value: string|undefined = undefined) : Promise<void> {
		switch (action) {
			case api.METHODS.GET:
				responseJSON = await api.getDataById(entity, id);
				break;
			case api.METHODS.CREATE:
				responseJSON = await api.postData(entity, {testField: value});
				break;
			case api.METHODS.UPDATE:
				responseJSON = await api.putData(entity, {testField: value}, id);
				break;
			case api.METHODS.REPLACE:
				responseJSON = await api.patchData(entity, {testField: value});
				break;
			case api.METHODS.DELETE:
				responseJSON = await api.deleteData(entity, id);
				break;
			default:
				responseJSON = {error: "Unrecognized action"};
				break;
		}
	}

	// Each time the response changes, update the string
	$: {
		responseString = JSON.stringify(responseJSON, null, 2);
	}
</script>

<div>
	<pre>{responseString}</pre>
	<label for="method">Action to perform</label>
	<select bind:value={selectedAction} id="method">
		{#each Object.values(api.METHODS) as method}
			<option value={method} selected={selectedAction === method}>{method}</option>
		{/each}
	</select>
	<label for="entity">Entity</label>
	<select bind:value={selectedEntity} id="entity">
		<!-- If the action is GET or DELETE, allow the user to choose an entity -->
		<!-- Otherwise, only offer the TESTS entity to avoid creating an interface
			for creating/modifying each entity -->
		{#if [api.METHODS.GET, api.METHODS.DELETE].includes(selectedAction)}
			{#each Object.values(ENDPOINTS) as entity}
				<option value={entity} selected={selectedEntity === entity}>{entity}</option>
			{/each}
		{/if}
		<option value={ENDPOINTS.TESTS} selected={selectedEntity === ENDPOINTS.TESTS}>{ENDPOINTS.TESTS}</option>
	</select>
	{#if [api.METHODS.GET, api.METHODS.UPDATE, api.METHODS.REPLACE, api.METHODS.DELETE].includes(selectedAction)}
		<label for="id">ID (0 for all)</label>
		<input bind:value={selectedId} type="number" id="id" />
	{/if}
	{#if [api.METHODS.CREATE, api.METHODS.UPDATE, api.METHODS.REPLACE].includes(selectedAction)}
		<label for="value">Value to send</label>
		<input bind:value={selectedValue} type="text" id="value" />
	{/if}
	<button on:click={() => {triggerAction(selectedAction, selectedEntity, selectedId, selectedValue)}}>Submit</button>
</div>
