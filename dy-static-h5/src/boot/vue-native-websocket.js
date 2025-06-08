import { boot } from "quasar/wrappers";
import VueNativeSock from "vue-native-websocket-vue3";
import { useSocketStore } from "src/cs-client-web/stores/socket";

export default boot(async ({ app }) => {
  // ✅ 现在 Pinia 已经注册，可以安全调用 store
  const store = useSocketStore();
  store.appConfig = app.config;

  app.use(VueNativeSock, "//127.0.0.1", {
    store,
    format: "json",
    connectManually: true,
    reconnection: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
  });
});
