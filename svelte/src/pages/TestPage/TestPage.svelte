<script lang="ts">
	// Elements
	import Button from "../../components/elements/Button/Button.svelte";
	import Option from "../../components/elements/Option/Option.svelte";
	import Input from "../../components/elements/Input/Input.svelte";
	import Spinner from "../../components/elements/icons/menus/Spinner/Spinner.svelte";
	// Composites
	import MessageComponent from "../../components/composite/Message/Message.svelte";
	import PopUp from "../../components/composite/PopUp/PopUp.svelte";
	import Card from "../../components/composite/Card/Card.svelte";
	import ProfileCard from "../../components/composite/ProfileCard/ProfileCard.svelte";
	import Member from "../../components/composite/Member/Member.svelte";
	import ChatComponent from "../../components/composite/Chat/Chat.svelte";
	import OptionGroup from "../../components/composite/OptionGroup/OptionGroup.svelte";
	// Icons
	import AccountIcon from "../../components/elements/icons/menus/AccountIcon.svelte";
	import ArrowDownIcon from "../../components/elements/icons/menus/ArrowDownIcon.svelte";
	import ArrowRightIcon from "../../components/elements/icons/menus/ArrowRightIcon.svelte";
	import BurgerMenuIcon from "../../components/elements/icons/menus/BurgerMenuIcon.svelte";
	import CrossIcon from "../../components/elements/icons/menus/CrossIcon.svelte";
	import EditIcon from "../../components/elements/icons/menus/EditIcon.svelte";
	import HelpIcon from "../../components/elements/icons/menus/HelpIcon.svelte";
	import HomeIcon from "../../components/elements/icons/menus/HomeIcon.svelte";
	import LessIcon from "../../components/elements/icons/menus/LessIcon.svelte";
	import MoreIcon from "../../components/elements/icons/menus/MoreIcon.svelte";
	import PhoneIcon from "../../components/elements/icons/menus/PhoneIcon.svelte";
	import PointerIcon from "../../components/elements/icons/menus/PointerIcon.svelte";
	import SearchIcon from "../../components/elements/icons/menus/SearchIcon.svelte";
	import SettingsIcon from "../../components/elements/icons/menus/SettingsIcon.svelte";
	import StarIcon from "../../components/elements/icons/menus/StarIcon.svelte";
	// Utilities & tools
	import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
	import * as authentifier from "../../common/tools/_auth";
	import { appRoutes } from "../../common/tools/_routing";
	// Classes
	import { createToast } from "../../common/tools/_utils";
	import type { ToastType } from "svelte-toasts/types/common";
	// Test data
	import * as fakeData from "./fakeData";

	/**
	 * Show a toast notification
	 *
	 * @param {string} message The message to display
	 * @param {string} title The title of the toast
	 * 
	 * @returns {void}
	 */
	function showToast(message: string, title: string, duration : number = 5000, type : ToastType = "success") : void {
		toasts.add(createToast(message, title, duration, type));
	};
</script>

<h2>User Tests</h2>
<button on:click={() => authentifier.logout()}>Logout</button>
<!-- Display the currentUser object in raw format -->
<p>
	String:
	{fakeData.testUser.toString()}
</p>
<p>JSON:</p>
<pre>{JSON.stringify(fakeData.testUser, null, 2)}</pre>

<h2>API Tests</h2>
<p>
	If you want to access the API tests, please go to the
	page <a href={appRoutes.apiTest.path}>{appRoutes.apiTest.name}</a>.
</p>
<pre>
User object endpoint: {JSON.stringify(
		fakeData.testUser.getEndpoint(),
		null,
		2
	)}
Current user IRI: {JSON.stringify(fakeData.testUser.getIRI(), null, 2)}
</pre>

<h2>Component Tests</h2>

<h3>Elements</h3>

<div class="component">
	<h4>Button</h4>
	<Button
		icon={HelpIcon}
		on:click={() => showToast("Button clicked!", Button.name)}
		>Click here</Button
	>
</div>
<div class="component">
	<h4>Input field</h4>
	<Input
		placeholder="Enter text"
		type="text"
		id="test"
		value="Value"
		icon={SearchIcon}
		on:valueChange={(e) =>
			showToast(
				"Input value changed: " + e.detail,
				Input.name
			)}
		on:submit={(e) => showToast("Input submitted!", Input.name)}
	/>
</div>
<div class="component">
	<h4>Spinner</h4>
	<Spinner />
</div>

<h4>Icons</h4>
<div class="component">
	<h5>Avatar/User</h5>
	<div class="icon"><AccountIcon /></div>
</div>
<div class="component">
	<h5>Arrow down</h5>
	<div class="icon"><ArrowDownIcon /></div>
</div>
<div class="component">
	<h5>Arrow right</h5>
	<div class="icon"><ArrowRightIcon /></div>
</div>
<div class="component">
	<h5>Burger menu</h5>
	<div class="icon"><BurgerMenuIcon /></div>
</div>
<div class="component">
	<h5>Cross</h5>
	<div class="icon"><CrossIcon /></div>
</div>
<div class="component">
	<h5>Edit</h5>
	<div class="icon"><EditIcon /></div>
</div>
<div class="component">
	<h5>Help</h5>
	<div class="icon"><HelpIcon /></div>
</div>
<div class="component">
	<h5>Home</h5>
	<div class="icon"><HomeIcon /></div>
</div>
<div class="component">
	<h5>Less</h5>
	<div class="icon"><LessIcon /></div>
</div>
<div class="component">
	<h5>More</h5>
	<div class="icon"><MoreIcon /></div>
</div>
<div class="component">
	<h5>Phone</h5>
	<div class="icon"><PhoneIcon /></div>
</div>
<div class="component">
	<h5>Pointer</h5>
	<div class="icon"><PointerIcon /></div>
</div>
<div class="component">
	<h5>Search</h5>
	<div class="icon"><SearchIcon /></div>
</div>
<div class="component">
	<h5>Settings</h5>
	<div class="icon"><SettingsIcon /></div>
</div>
<div class="component">
	<h5>Star</h5>
	<div class="icon"><StarIcon /></div>
</div>

<h3>Composites</h3>
<div class="component">
	<h4>Message</h4>
	<MessageComponent
		message={fakeData.testMsg}
		on:dropdownClick={() => {
			showToast(
				"Message menu opened! (fake)",
				MessageComponent.name
			);
		}}
	/>
</div>
<div class="component">
	<h4>Pop-up</h4>
	<PopUp
		title="Title"
		showCloseButton={true}
		on:close={() => {
			showToast("Pop-up closed! (fake)", PopUp.name);
		}}
		><p>Description</p>
		<Button
			on:click={() => {
				showToast("Pop-up button clicked!", Button.name);
			}}>Ok</Button
		></PopUp
	>
</div>

<div class="component">
	<h4>Card</h4>
	<Card
		title="Title"
		icon={ArrowRightIcon}
		on:titleClick={() => {
			showToast("Title clicked!", Card.name);
		}}
		on:settingsClick={() => {
			showToast("Menu clicked!", Card.name);
		}}>Content</Card
	>
</div>
<div class="component">
	<h4>Profile Card</h4>
	<ProfileCard
		nickname="Nickname"
		on:clickName={() => {
			showToast("Name clicked!", ProfileCard.name);
		}}
		on:close={() => {
			showToast("Logout icon clicked!", ProfileCard.name);
		}}
	/>
</div>
<div class="component">
	<h4>Option</h4>
	<Option
		icon={HelpIcon}
		on:click={() => {
			showToast("Option clicked!", Option.name);
		}}
	>
		Option
	</Option>
</div>
<div class="component">
	<h4>Chat</h4>
	<ChatComponent
		chat={fakeData.testChat}
		watchingUser={fakeData.testUser}
		on:msgDropdownClick={(event) => {
			showToast("Message menu " + event.detail.message.getId() + " opened!", ChatComponent.name);
		}}
		on:messageSend={(event) => {
			showToast("Message sent: " + event.detail, ChatComponent.name);
		}}
		on:settingsClick={(event) => {
			showToast("Chat menu opened!", ChatComponent.name);
		}}
		on:memberSettingsClick={(event) => {
			showToast("Member menu " + event.detail.assignment.getUser().getNickname() + " opened!", ChatComponent.name);
		}}
	/>
</div>

<div class="component">
	<h4>Member</h4>
	<Member
		assignment={fakeData.testAssignment}
		on:settingsClick={() =>
			showToast("Member menu opened!", Member.name)}
	/>
</div>

<div class="component">
	<h4>OptionGroup</h4>
	<OptionGroup
		options={[
			{
				text: "Help",
				icon: HelpIcon,
				handleClick: (e) => {
					showToast("Help clicked!", OptionGroup.name);
				},
			},
			{
				text: "Settings",
				icon: SettingsIcon,
				handleClick: (e) => {
					showToast("Settings clicked!", OptionGroup.name);
				},
			},
			{
				text: "Favorites",
				icon: StarIcon,
				handleClick: (e) => {
					showToast("Favorites clicked!", OptionGroup.name);
				},
			},
			{ text: "No icon, no click function" },
		]}
	/>
</div>

<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	@import "./TestPage.scss";
</style>
