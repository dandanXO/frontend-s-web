import { boot } from "quasar/wrappers";
import VueNativeSock from "vue-native-websocket-vue3";
import { useSocketStore } from "src/cs-client-web/stores/socket";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  const store = useSocketStore();
  store.appConfig = app.config;

  // 使用VueNativeSock插件，并进行相关配置
  app.use(VueNativeSock, "//127.0.0.1", {
    // 启用pinia集成 | enable pinia integration
    store: store,
    // 数据发送/接收使用使用json
    format: "json",
    // 开启手动调用 connect() 连接服务器
    connectManually: true,
    // 开启自动重连
    reconnection: false,
    // 尝试重连的次数
    reconnectionAttempts: 5,
    // 重连间隔时间
    reconnectionDelay: 3000
  });
});
