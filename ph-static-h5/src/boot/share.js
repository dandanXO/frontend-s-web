import { boot } from "quasar/wrappers";
import VueSocialSharing from "vue-social-sharing";

export default boot(({ app }) => {
  console.log("USe");
  app.use(VueSocialSharing);
});
