import { boot } from "quasar/wrappers";
import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";

export default boot(({ app }) => {
  app.use(fpjsPlugin, {
    loadOptions: {
      apiKey: "3mvAE4wtzkCDyti1QAXp",
      region: "ap"
    }
  })
});
