import "./app.postcss";
import App from "./App.svelte";
import * as Realm from "realm-web";
import { Constants } from "./Constants";


export const realmApp = new Realm.App({ id: import.meta.env.VITE_ATLAS_CLIENT });


const app = new App({
  target: document.getElementById("app"),
});

export default app;
