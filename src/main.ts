import "./app.postcss";
import App from "./App.svelte";
import * as Realm from "realm-web";

export const realmApp = new Realm.App({ id: "application-0-acbeg" });

const app = new App({
  target: document.getElementById("app"),
});

export default app;
