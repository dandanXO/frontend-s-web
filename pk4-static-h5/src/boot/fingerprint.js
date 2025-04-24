import { boot } from "quasar/wrappers";
import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

export default boot(({ app }) => {
  app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: "JIeeb4OEgJNQWe3FtHix",
      region: "ap"
    }
  })
});
