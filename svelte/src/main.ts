import App from "./App.svelte";
import "./style/global.scss";

const app = new App({
	// Add a ! to indicate that document.getElementById("app")! will never be null
	// (specific to TypeScript: here, the element cannot be null, but TypeScript doesn't know that)
	target: document.getElementById("app")!,
});

export default app;
