import { boot } from "quasar/wrappers";
import { userStore } from "stores/index";
import VueGtag from "vue-gtag-next";

export default boot(({ app, router }) => {
  const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID;
  const store = userStore();

  if (process.env.NODE_ENV === "production" && measurementId) {
    app.use(VueGtag, {
      property: {
        id: measurementId
      }
    });
    console.log("Google Analytics initialised.");

    router.afterEach((to) => {
      app.config.globalProperties.$gtag.pageview({
        page_title: to.meta.title || "Default Title",
        page_location: window.location.href,
        page_path: to.fullPath
      });

      const referrer = document.referrer;

      if (!(referrer && referrer.includes(window.location.hostname))) {
        const source = referrer || "Direct";

        app.config.globalProperties.$gtag.event("user_referral", {
          custom_user_id: store.nickName,
          referrer_source: source
          // debug_mode: true
        });
      }
    });
  } else {
    console.log("Google Analytics is disabled.");
  }
});
