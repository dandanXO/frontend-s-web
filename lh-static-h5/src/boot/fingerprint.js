import { boot } from "quasar/wrappers";
import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

export default boot(({ app }) => {
  app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: "b1A4V9htZ4ySmb8ycMQb",
      region: "ap"
    }
  })
});
