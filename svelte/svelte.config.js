import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  
  // Désactiver les avertissements pour les sélecteurs CSS inutilisés
  onwarn: (warning, handler) => {
	if (warning.code === 'css-unused-selector') {
		return;
	}
	handler(warning);
},
}
