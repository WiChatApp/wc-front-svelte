<style>
	@import "./Footer.scss";
</style>

<script lang="ts">
	import * as routing from "../../../common/tools/_routing";
	import Logo from "../../../../static/assets/img/logo.png";
	import InstaIcon from "../../elements/icons/brands/social-media/InstaIcon.svelte";
	import XIcon from "../../elements/icons/brands/social-media/XIcon.svelte";
	import TikTokIcon from "../../elements/icons/brands/social-media/TikTokIcon.svelte";
</script>

<footer>
	<div class="row">
		<div class="col">
			<h1>Aide</h1>
			<ul>
				<li><a href="#faq">FAQ</a></li>
				<li><a href="#contact">Contact</a></li>
			</ul>
		</div>
		<div class="col">
			<h1>WiChat sur les réseaux sociaux</h1>
			<ul class="social">
				<li><a href="#tiktok"><TikTokIcon/></a></li>
				<li><a href="#insta"><InstaIcon/></a></li>
				<li><a href="#x"><XIcon/></a></li>
			</ul>
		</div>
		<div class="col">
			<h1>En savoir plus</h1>
				<ul>
					<li><a href="#about">À propos</a></li>
					<li><a href="#mentions-legales">Mentions légales & confidentialité</a></li>
					<li><a href="#cookies">Politique de cookies</a></li>
				</ul>
		</div>
	</div>
	<div class="row copyright">
		<a href={routing.appRoutes.home.path}>
			<img src={Logo} alt="WiChat" class="logo" />
		</a>
		<p>&copy; {new Date().getFullYear()} - Tous droits réservés</p>
	</div>
</footer>